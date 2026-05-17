"""
auth.py — Gestion de l'authentification JWT pour Production Lakay
"""
import os
import json
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional

import bcrypt

from jose import JWTError, jwt

from database import get_connection

# ── Configuration ───────────────────────────────────────────────────────────
SECRET_KEY = os.getenv("SECRET_KEY", "lakay-super-secret-key-change-in-production-2024")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 heures

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@productionlakay.ht")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "Lakay@2024!")
ADMIN_NAME = os.getenv("ADMIN_NAME", "Witly Durosier")


# ── Fonctions utilitaires ────────────────────────────────────────────────────
def hash_password(plain: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(plain.encode('utf-8'), salt)
    return hashed.decode('utf-8')


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode('utf-8'), hashed.encode('utf-8'))


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None


# ── Gestion des admins ───────────────────────────────────────────────────────
def ensure_default_admin():
    """Crée l'admin par défaut s'il n'existe pas encore."""
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT id FROM admins WHERE email = ?", (ADMIN_EMAIL,))
    existing = cur.fetchone()

    if not existing:
        hashed = hash_password(ADMIN_PASSWORD)
        cur.execute(
            "INSERT INTO admins (email, password, name, role) VALUES (?, ?, ?, ?)",
            (ADMIN_EMAIL, hashed, ADMIN_NAME, "admin")
        )
        conn.commit()
        print(f"[AUTH] Admin par defaut cree: {ADMIN_EMAIL}")
    else:
        print(f"[AUTH] Admin existant: {ADMIN_EMAIL}")

    conn.close()


def authenticate_admin(email: str, password: str) -> Optional[dict]:
    """Vérifie les identifiants et retourne le profil admin ou None."""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM admins WHERE email = ?", (email,))
    row = cur.fetchone()
    conn.close()

    if not row:
        return None
    if not verify_password(password, row["password"]):
        return None

    return {
        "id": row["id"],
        "email": row["email"],
        "name": row["name"],
        "role": row["role"],
    }


def get_admin_by_id(admin_id: int) -> Optional[dict]:
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, email, name, role, created_at FROM admins WHERE id = ?", (admin_id,))
    row = cur.fetchone()
    conn.close()
    return dict(row) if row else None


def change_admin_password(admin_id: int, old_password: str, new_password: str) -> bool:
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT password FROM admins WHERE id = ?", (admin_id,))
    row = cur.fetchone()
    if not row or not verify_password(old_password, row["password"]):
        conn.close()
        return False
    hashed = hash_password(new_password)
    cur.execute("UPDATE admins SET password = ? WHERE id = ?", (hashed, admin_id))
    conn.commit()
    conn.close()
    return True


def update_admin_profile(admin_id: int, name: str = None, email: str = None) -> bool:
    conn = get_connection()
    cur = conn.cursor()
    if name and email:
        cur.execute("UPDATE admins SET name = ?, email = ? WHERE id = ?", (name, email, admin_id))
    elif name:
        cur.execute("UPDATE admins SET name = ? WHERE id = ?", (name, admin_id))
    elif email:
        cur.execute("UPDATE admins SET email = ? WHERE id = ?", (email, admin_id))
    conn.commit()
    conn.close()
    return True
