from fastapi import Depends, HTTPException, Request, status
from app.services.local_auth import user_for_token


def current_user_id(request: Request) -> str:
    authorization = request.headers.get("Authorization", "")
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Sign in required")

    token = authorization.removeprefix("Bearer ").strip()
    user_id = user_for_token(token)
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session")
    return user_id


UserId = Depends(current_user_id)
