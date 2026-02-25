from uuid import UUID
from fastapi import HTTPException, status
from sqlmodel import Session

from repositories.user_repository import UserRepository
from schemas.user import UserUpdate, UserResponse, UserRole


class UserService:
    def __init__(self, users: UserRepository):
        self.users = users

    def get_all_users(self, session: Session) -> list[UserResponse]:
        users = self.users.list_all(session)
        return [UserResponse.from_orm(user) for user in users]

    def get_user(self, session: Session, user_id: UUID) -> UserResponse:
        user = self.users.get(session, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Пользователь не найден"
            )
        return UserResponse.from_orm(user)

    def update_user(self, session: Session, user_id: UUID, user_update: UserUpdate, current_user_id: UUID) -> UserResponse:
        if current_user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Нельзя изменить чужой профиль"
            )
        
        user = self.users.get(session, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Пользователь не найден"
            )
        
        updated_user = self.users.update(session, user_id, user_update)
        return UserResponse.from_orm(updated_user)

    def delete_user(self, session: Session, user_id: UUID, current_user_id: UUID) -> None:
    #нужно ли вообще
        current_user = self.users.get(session, current_user_id)
        if not current_user or current_user.role != UserRole.organizer:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin privileges required"
            )
        
        user = self.users.get(session, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Пользователь не найден"
            )
        
        self.users.delete(session, user_id)


def get_user_service():
    return UserService(UserRepository())