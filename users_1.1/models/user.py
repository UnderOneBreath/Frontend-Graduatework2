from sqlmodel import Field, Relationship
from pydantic import field_validator
from typing import Any, List
from datetime import datetime
from enum import Enum
from uuid import UUID, uuid4

from models.basemodel import EntityBaseModel


class UserRole(str, Enum):
    organizer = "organizer"
    participant = "participant"


class User(EntityBaseModel, table=True):
    __tablename__ = "user"

    id: UUID | None = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(index=True)
    email: str = Field(unique=True, index=True)
    phone: str = Field(unique=True, index=True)
    password: str
    role: UserRole
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)