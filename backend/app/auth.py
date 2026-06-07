    from __future__ import annotations
    import hashlib
    import hmac
    import os
    import secrets
    from datetime import datetime, timedelta, timezone
    from typing import Any, Dict

    import jwt
    from fastapi import Depends, HTTPException
    from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

    from app.storage import find_user_by_email

    TOKEN_TTL_SECONDS = 60 * 60 * 12
    PASSWORD_ITERATIONS = 120_000
    AUTH_SECRET = os.getenv("AUTH_SECRET", "dev-auth-secret-change-me")
    JWT_ALGORITHM = "HS256"
    bearer_scheme = HTTPBearer(auto_error=False)


    def hash_password(password: str) -> str:
        salt = secrets.token_hex(16)
        digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), PASSWORD_ITERATIONS)
        return f"pbkdf2_sha256${PASSWORD_ITERATIONS}${salt}${digest.hex()}"


    def verify_password(password: str, password_hash: str) -> bool:
        try:
            algorithm, iterations, salt, expected = password_hash.split("$", 3)
            if algorithm != "pbkdf2_sha256":
                return False
            digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), int(iterations))
            return hmac.compare_digest(digest.hex(), expected)
        except ValueError:
            return False


    def public_user(user: Dict[str, Any]) -> Dict[str, Any]:
        return {key: value for key, value in user.items() if key != "passwordHash"}


    def create_access_token(user: Dict[str, Any]) -> str:
        expires_at = datetime.now(timezone.utc) + timedelta(seconds=TOKEN_TTL_SECONDS)
        payload = {
            "sub": user["id"],
            "email": user["email"],
            "role": user["role"],
            "exp": expires_at,
            "iat": datetime.now(timezone.utc),
        }
        return jwt.encode(payload, AUTH_SECRET, algorithm=JWT_ALGORITHM)


    def get_current_user(credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme)) -> Dict[str, Any]:
        if credentials is None or credentials.scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Authentication required")

        try:
            payload = jwt.decode(credentials.credentials, AUTH_SECRET, algorithms=[JWT_ALGORITHM])
        except jwt.ExpiredSignatureError as exc:
            raise HTTPException(status_code=401, detail="Authentication token expired") from exc
        except jwt.InvalidTokenError as exc:
            raise HTTPException(status_code=401, detail="Invalid authentication token") from exc

        user = find_user_by_email(payload.get("email", ""))
        if not user:
            raise HTTPException(status_code=401, detail="User no longer exists")
        return user


    def require_roles(*roles: str):
        def dependency(user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
            if user.get("role") not in roles:
                raise HTTPException(status_code=403, detail="Insufficient permissions")
            return user

        return dependency
