from typing import Generator
from sqlmodel import Session, create_engine
from sqlalchemy.orm import sessionmaker

engine = create_engine('sqlite:///db.sqlite3', echo=True)
SessionLocal = sessionmaker(bind=engine)

def get_session() -> Generator[Session, None, None]:
    with SessionLocal() as session:
        try:
            yield session
        except Exception as e:
            session.rollback()
            raise  # Re-raise оригинальное исключение
        finally:
            session.close()
