# backend/app/services/ocr_service.py

import pytesseract
from PIL import Image
from fastapi import UploadFile
from io import BytesIO
import re
from datetime import datetime
from typing import Dict, Any
import cv2
import numpy as np

# --- ADVANCED PARSING AND CLASSIFICATION LOGIC ---

def parse_total_amount(text: str) -> float:
    priority_amounts = []
    other_amounts = []
    amount_pattern = re.compile(r'(?:[₹$rs\.]\s*)?(\d+\.\d{2})')
    keywords = ["total", "subtotal", "sub total", "amount", "balance", "net"]
    for line in text.lower().split('\n'):
        matches = amount_pattern.findall(line.replace(',', ''))
        if not matches:
            continue
        line_amounts = [float(m) for m in matches]
        if any(keyword in line for keyword in keywords):
            priority_amounts.extend(line_amounts)
        else:
            other_amounts.extend(line_amounts)
    if priority_amounts:
        return max(priority_amounts)
    if other_amounts:
        return max(other_amounts)
    return 0.0

def classify_category_with_scoring(text: str) -> str:
    text = text.lower()
    scores = {"Food": 0, "Travel": 0, "Shopping": 0, "Bills": 0, "Misc": 1}
    keyword_scores = {
        "Food": {"restaurant": 10, "bhavan": 10, "cafe": 8, "food": 5, "hotel": 5, "swiggy": 5, "zomato": 5, "pongal": 3, "vadai": 3, "roast": 3, "tea": 2},
        "Travel": {"uber": 10, "ola": 10, "taxi": 8, "flight": 8, "fuel": 5, "gas": 5, "metro": 3},
        "Shopping": {"walmart": 10, "target": 10, "amazon": 10, "dmart": 8, "market": 5},
        "Bills": {"bill": 2, "invoice": 2, "electricity": 10, "phone": 8, "bill no": -5}
    }
    for category, keywords in keyword_scores.items():
        for keyword, score in keywords.items():
            if keyword in text:
                scores[category] += score
    return max(scores, key=scores.get)

# --- THE MULTI-PASS OCR ENGINE ---

async def process_receipt_image(file: UploadFile) -> Dict[str, Any]:
    image_content = await file.read()
    
    try:
        np_arr = np.frombuffer(image_content, np.uint8)
        image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    except Exception:
        raise ValueError("Invalid or corrupted image file.")

    # --- Pass 1: Simple Thresholding (Good for clean receipts) ---
    _, simple_thresh_image = cv2.threshold(gray_image, 150, 255, cv2.THRESH_BINARY)
    text_simple = pytesseract.image_to_string(simple_thresh_image)

    # --- Pass 2: Adaptive Thresholding (Good for receipts with shadows/creases) ---
    adaptive_thresh_image = cv2.adaptiveThreshold(
        gray_image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
        cv2.THRESH_BINARY, 11, 2
    )
    text_adaptive = pytesseract.image_to_string(adaptive_thresh_image)
    
    # --- The Decision Logic: Pick the best result ---
    # We choose the result that has the most characters, as it's the most likely to be correct.
    results = [text_simple, text_adaptive]
    best_text = max(results, key=len)

    # Now, parse the BEST text we found
    total_amount = parse_total_amount(best_text)
    category = classify_category_with_scoring(best_text)
    
    return {
        "amount": total_amount,
        "category": category,
        "description": f"Scanned Receipt ({file.filename})",
        "date": datetime.now().isoformat(),
        "extracted_text": best_text,
    }