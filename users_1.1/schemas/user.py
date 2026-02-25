from pydantic import field_validator
from typing import Any, List, Optional

from utils.validators.user_data_validator import UserDataValidator
from models.basemodel import EntityBaseModel
from models.user import UserRole


class UserResponse(EntityBaseModel):
    name: str
    email: str
    phone: str
    role: UserRole



class UserCreate(EntityBaseModel):
    name: str
    email: str
    phone: str
    password: str
    role: UserRole
    # created_at: datetime

    @field_validator('email')
    @classmethod
    def validate(cls, value: str):
        try:
            UserDataValidator.validate_email_on_create(value)
        except  Exception() as e:
            raise ValueError(str(e))
        return value

    @field_validator('phone')
    @classmethod
    def validate(cls, value: str):
        try:
            UserDataValidator.validate_phone_on_create(value)
        except  Exception() as e:
            raise ValueError(str(e))
        return value

class UserUpdate(EntityBaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[UserRole] = None

    @field_validator('phone')
    @classmethod
    def validate(cls, value: str):
        try:
            UserDataValidator.validate_phone_on_update(value)
        except  Exception() as e:
            raise ValueError(str(e))
        return value