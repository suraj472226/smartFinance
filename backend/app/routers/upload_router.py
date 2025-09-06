# backend/app/routers/upload_router.py
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from typing import Dict, Any

from .. import auth
from ..models import schemas
from ..services import ocr_service

router = APIRouter()

@router.post("/receipt", response_model=Dict[str, Any])
async def upload_receipt(
    file: UploadFile = File(...),
    current_user: schemas.UserInDB = Depends(auth.get_current_user)
):
    """
    Endpoint to upload a receipt image, process it with OCR,
    and return the extracted expense details.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File provided is not an image."
        )

    try:
        extracted_data = await ocr_service.process_receipt_image(file)
        return extracted_data
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="There was an error processing the file."
        )
