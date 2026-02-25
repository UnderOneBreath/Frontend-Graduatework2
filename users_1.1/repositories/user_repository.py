from typing import Optional, List
from uuid import UUID
from .base_repository import BaseRepository
from sqlmodel import Session, select

from models.user import User


class UserRepository(BaseRepository):
    def __init__(self):
        super().__init__(User)

    def get_by_email(self, session: Session, email: str) -> Optional[User]:
        return session.query(User).filter(User.email == email).first()

    def get_by_phone(self, session: Session, phone: str) -> Optional[User]:
        return session.query(User).filter(User.phone == phone).first()

    def update_password(self, session: Session, user: User, new_password: str) -> None:
        user.password = new_password
        session.add(user)
        session.commit()
        session.refresh(user)
