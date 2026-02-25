from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List

from schemas.user import UserUpdate, UserResponse
from config.database import get_session
from config.security import SecurityManager
from services.user_service import UserService, get_user_service
from responses.factory import Factory
from models.user import UserRole
from responses.API_response import SuccessAPIResponse

router = APIRouter()


@router.get("/", response_model=SuccessAPIResponse)
def get_all_users(session: Session = Depends(get_session), service: UserService = Depends(get_user_service)):
    return Factory.create_ok_reponse(data=service.get_all_users(session))

@router.get("/{user_id}", response_model=SuccessAPIResponse)
def get_user(user_id: UUID, session: Session = Depends(get_session), service: UserService = Depends(get_user_service)):
    return Factory.create_ok_reponse(data=service.get_user(session, user_id))


@router.patch("/{user_id}", response_model=SuccessAPIResponse)
def update_user(user_id: UUID, user_update: UserUpdate,session: Session = Depends(get_session), service: UserService = Depends(get_user_service), current_user: tuple[UUID, UserRole] = Depends(SecurityManager.decode_access_token)):
    current_user_id, current_user_role = current_user
    return Factory.create_ok_reponse(data=service.update_user(session, user_id, user_update, current_user_id))


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: UUID, session: Session = Depends(get_session), service: UserService = Depends(get_user_service), current_user: tuple[UUID, UserRole] = Depends(SecurityManager.decode_access_token)):
    current_user_id, current_user_role = current_user
    service.delete_user(session, user_id, current_user_id)
    return None