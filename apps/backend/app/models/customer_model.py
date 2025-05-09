from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, UUID4


class CustomerCreate(BaseModel):
    first_name: str = Field(
        description="Customer's first name",
        min_length=1,
        max_length=50,
        examples=["John"],
    )
    last_name: str = Field(
        description="Customer's last name",
        min_length=1,
        max_length=50,
        examples=["Doe"],
    )
    email: EmailStr = Field(
        description="Customer's email address", examples=["john.doe@example.com"]
    )
    phone: str = Field(
        description="Customer's phone number",
        min_length=1,
        max_length=20,
        examples=["+1234567890"],
    )

    class Config:
        schema_extra = {"description": "Schema for creating a new customer"}


class CustomerResponse(BaseModel):
    id: UUID4 = Field(
        description="Unique identifier for the customer"
    )
    first_name: str = Field(
        description="Customer's first name",
        examples=["John"],
    )
    last_name: str = Field(
        description="Customer's last name",
        examples=["Doe"],
    )
    email: EmailStr = Field(
        description="Customer's email address", examples=["john.doe@example.com"]
    )
    phone: str = Field(
        description="Customer's phone number",
        examples=["+1234567890"],
    )
    organization_id: UUID4 = Field(
        description="ID of the organization the customer belongs to",
    )
    created_at: datetime = Field(
        description="Date and time the customer was created",
        examples=["2025-02-21T11:04:48.476531"],
    )

    class Config:
        from_attributes = True
        schema_extra = {
            "description": "Schema for customer response data",
            "example": {
                "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                "first_name": "John",
                "last_name": "Doe",
                "email": "john.doe@example.com",
                "phone": "+1234567890",
                "organization_id": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
                "created_at": "2025-02-21T11:04:48.476531",
            },
        }


class CustomerFilter(BaseModel):
    search: Optional[str] = Field(default=None) 