"""
main.py — Serveur FastAPI de Production Lakay
Lance avec : uvicorn main:app --reload --port 8000
"""
import json
import os
import re
import uuid
import shutil
import io
from datetime import datetime
from pathlib import Path
from typing import Optional, List

from PIL import Image

import aiofiles
from fastapi import (
    FastAPI, HTTPException, Depends, status,
    UploadFile, File, Form, Request
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from auth import (
    authenticate_admin, create_access_token, decode_token,
    ensure_default_admin, get_admin_by_id, change_admin_password,
    hash_password
)
from database import get_connection, init_db

# ── Initialisation ───────────────────────────────────────────────────────────
app = FastAPI(title="Production Lakay API", version="1.0.0")

UPLOAD_DIR = Path(__file__).parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

STATIC_DIR = Path(__file__).parent / "static"
STATIC_DIR.mkdir(exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Fichiers statiques (uploads images + panel admin)
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

security = HTTPBearer(auto_error=False)

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5 MB


# ── Schémas Pydantic ─────────────────────────────────────────────────────────
class LoginRequest(BaseModel):
    email: str
    password: str


class ProductPrice(BaseModel):
    label: str
    value: float


class ProductCreate(BaseModel):
    id: Optional[str] = None
    name: str
    description: Optional[str] = None
    price: Optional[float] = None
    prices: Optional[List[ProductPrice]] = None
    category: str
    unit: Optional[str] = None
    image_url: Optional[str] = None
    gallery: Optional[List[str]] = None
    is_available: bool = True


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    prices: Optional[List[ProductPrice]] = None
    category: Optional[str] = None
    unit: Optional[str] = None
    image_url: Optional[str] = None
    gallery: Optional[List[str]] = None
    is_available: Optional[bool] = None


class CategoryCreate(BaseModel):
    name: str
    icon: Optional[str] = None
    sort_order: int = 0


class GalleryCreate(BaseModel):
    title: str
    category: str
    image_url: str


class SettingUpdate(BaseModel):
    value: str


class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str


class OrderCreate(BaseModel):
    product_id: str
    product_name: str
    category: str
    price: Optional[float] = None


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None


class AdminCreate(BaseModel):
    email: str
    password: str
    name: str


# ── Dépendances d'authentification ──────────────────────────────────────────
def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Token manquant")
    payload = decode_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Token invalide ou expiré")
    admin = get_admin_by_id(payload.get("sub"))
    if not admin:
        raise HTTPException(status_code=401, detail="Administrateur introuvable")
    return admin


# ── Helpers ──────────────────────────────────────────────────────────────────
def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[àáâãäå]', 'a', text)
    text = re.sub(r'[èéêë]', 'e', text)
    text = re.sub(r'[ìíîï]', 'i', text)
    text = re.sub(r'[òóôõö]', 'o', text)
    text = re.sub(r'[ùúûü]', 'u', text)
    text = re.sub(r'[ç]', 'c', text)
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')


def row_to_product(row) -> dict:
    p = dict(row)
    p["prices"] = json.loads(p["prices"]) if p["prices"] else None
    p["gallery"] = json.loads(p["gallery"]) if p["gallery"] else []
    p["is_available"] = bool(p["is_available"])
    return p


# ── Routes Publiques ─────────────────────────────────────────────────────────
@app.get("/", include_in_schema=False)
async def root():
    return {"message": "Production Lakay API", "version": "1.0.0", "status": "running"}


@app.get("/api/products", tags=["Produits Publics"])
async def list_products(category: Optional[str] = None, available_only: bool = True):
    """Retourne tous les produits (filtre optionnel par catégorie)."""
    conn = get_connection()
    cur = conn.cursor()
    query = "SELECT * FROM products WHERE 1=1"
    params = []
    if available_only:
        query += " AND is_available = 1"
    if category and category.lower() != "tous":
        query += " AND category = ?"
        params.append(category)
    query += " ORDER BY created_at ASC"
    cur.execute(query, params)
    rows = cur.fetchall()
    conn.close()
    return [row_to_product(r) for r in rows]


@app.get("/api/products/{product_id}", tags=["Produits Publics"])
async def get_product(product_id: str):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM products WHERE id = ?", (product_id,))
    row = cur.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Produit introuvable")
    return row_to_product(row)


@app.get("/api/categories", tags=["Catégories Publiques"])
async def list_categories():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM categories ORDER BY sort_order ASC, name ASC")
    rows = cur.fetchall()
    conn.close()
    return [dict(r) for r in rows]


@app.get("/api/settings", tags=["Paramètres Publics"])
async def get_public_settings():
    """Retourne les paramètres publics du site."""
    public_keys = ["site_name", "site_phone", "site_email", "site_address",
                   "delivery_note", "whatsapp_number", "maintenance_mode"]
    conn = get_connection()
    cur = conn.cursor()
    placeholders = ",".join("?" * len(public_keys))
    cur.execute(f"SELECT key, value FROM settings WHERE key IN ({placeholders})", public_keys)
    rows = cur.fetchall()
    conn.close()
    return {r["key"]: r["value"] for r in rows}


@app.post("/api/orders", status_code=201, tags=["Commandes"])
async def create_order(body: OrderCreate):
    """Enregistre un clic sur 'Commander' pour les statistiques."""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO orders (product_id, product_name, category, price) VALUES (?, ?, ?, ?)",
        (body.product_id, body.product_name, body.category, body.price)
    )
    conn.commit()
    conn.close()
    return {"message": "Clic enregistré"}


# ── Authentification Admin ───────────────────────────────────────────────────
@app.post("/api/admin/login", tags=["Admin — Auth"])
async def admin_login(body: LoginRequest):
    admin = authenticate_admin(body.email, body.password)
    if not admin:
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    token = create_access_token({"sub": str(admin["id"]), "email": admin["email"]})
    return {"access_token": token, "token_type": "bearer", "admin": admin}


@app.put("/api/admin/profile", tags=["Admin — Auth"])
async def admin_update_profile(body: ProfileUpdate, admin=Depends(get_current_admin)):
    from auth import update_admin_profile
    update_admin_profile(admin["id"], body.name, body.email)
    return {"message": "Profil mis à jour"}


@app.get("/api/admin/me", tags=["Admin — Auth"])
async def admin_me(admin=Depends(get_current_admin)):
    return admin


@app.post("/api/admin/change-password", tags=["Admin — Auth"])
async def admin_change_password(body: ChangePasswordRequest, admin=Depends(get_current_admin)):
    from auth import change_admin_password
    ok = change_admin_password(admin["id"], body.old_password, body.new_password)
    if not ok:
        raise HTTPException(status_code=400, detail="Ancien mot de passe incorrect")
    return {"message": "Mot de passe modifié avec succès"}


# ── Gestion des Produits (Admin) ─────────────────────────────────────────────
@app.get("/api/admin/products", tags=["Admin — Produits"])
async def admin_list_products(admin=Depends(get_current_admin)):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM products ORDER BY created_at DESC")
    rows = cur.fetchall()
    conn.close()
    return [row_to_product(r) for r in rows]


@app.post("/api/admin/products", status_code=201, tags=["Admin — Produits"])
async def admin_create_product(product: ProductCreate, admin=Depends(get_current_admin)):
    product_id = product.id or slugify(product.name)
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id FROM products WHERE id = ?", (product_id,))
    if cur.fetchone():
        product_id = f"{product_id}-{uuid.uuid4().hex[:6]}"

    prices_json = json.dumps([p.dict() for p in product.prices]) if product.prices else None
    gallery_json = json.dumps(product.gallery) if product.gallery else None

    cur.execute("""
        INSERT INTO products (id, name, description, price, prices, category, unit, image_url, gallery, is_available)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        product_id, product.name, product.description, product.price,
        prices_json, product.category, product.unit,
        product.image_url, gallery_json, int(product.is_available)
    ))
    conn.commit()

    cur.execute("SELECT * FROM products WHERE id = ?", (product_id,))
    row = cur.fetchone()
    conn.close()
    return row_to_product(row)


@app.put("/api/admin/products/{product_id}", tags=["Admin — Produits"])
async def admin_update_product(product_id: str, product: ProductUpdate, admin=Depends(get_current_admin)):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM products WHERE id = ?", (product_id,))
    existing = cur.fetchone()
    if not existing:
        conn.close()
        raise HTTPException(status_code=404, detail="Produit introuvable")

    fields = {}
    if product.name is not None:        fields["name"] = product.name
    if product.description is not None: fields["description"] = product.description
    if product.price is not None:       fields["price"] = product.price
    if product.prices is not None:      fields["prices"] = json.dumps([p.dict() for p in product.prices])
    if product.category is not None:    fields["category"] = product.category
    if product.unit is not None:        fields["unit"] = product.unit
    if product.image_url is not None:   fields["image_url"] = product.image_url
    if product.gallery is not None:     fields["gallery"] = json.dumps(product.gallery)
    if product.is_available is not None: fields["is_available"] = int(product.is_available)
    fields["updated_at"] = datetime.utcnow().isoformat()

    set_clause = ", ".join(f"{k} = ?" for k in fields)
    cur.execute(
        f"UPDATE products SET {set_clause} WHERE id = ?",
        list(fields.values()) + [product_id]
    )
    conn.commit()
    cur.execute("SELECT * FROM products WHERE id = ?", (product_id,))
    row = cur.fetchone()
    conn.close()
    return row_to_product(row)


@app.delete("/api/admin/products/{product_id}", tags=["Admin — Produits"])
async def admin_delete_product(product_id: str, admin=Depends(get_current_admin)):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id FROM products WHERE id = ?", (product_id,))
    if not cur.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Produit introuvable")
    cur.execute("DELETE FROM products WHERE id = ?", (product_id,))
    conn.commit()
    conn.close()
    return {"message": "Produit supprimé"}


@app.patch("/api/admin/products/{product_id}/toggle", tags=["Admin — Produits"])
async def admin_toggle_product(product_id: str, admin=Depends(get_current_admin)):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT is_available FROM products WHERE id = ?", (product_id,))
    row = cur.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Produit introuvable")
    new_val = 0 if row["is_available"] else 1
    cur.execute("UPDATE products SET is_available = ?, updated_at = ? WHERE id = ?",
                (new_val, datetime.utcnow().isoformat(), product_id))
    conn.commit()
    conn.close()
    return {"is_available": bool(new_val)}


# ── Upload d'images ──────────────────────────────────────────────────────────
@app.post("/api/admin/upload", tags=["Admin — Upload"])
async def upload_image(file: UploadFile = File(...), admin=Depends(get_current_admin)):
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Type de fichier non autorisé (JPEG, PNG, WebP, GIF)")

    content = await file.read()
    if len(content) > MAX_IMAGE_SIZE:
        raise HTTPException(status_code=400, detail="Fichier trop volumineux (max 5 MB)")

    # Traitement avec Pillow pour optimisation
    try:
        img = Image.open(io.BytesIO(content))
        
        # Convertir en RGB si nécessaire (pour sauvegarder en JPEG)
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
            
        # Redimensionnement si trop grand (max 1200px)
        max_size = 1200
        if max(img.size) > max_size:
            img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
            
        # Sauvegarde compressée
        output = io.BytesIO()
        img.save(output, format="JPEG", quality=85, optimize=True)
        compressed_content = output.getvalue()
        
        ext = ".jpg"
        filename = f"{uuid.uuid4().hex}{ext}"
        dest = UPLOAD_DIR / filename
        
        async with aiofiles.open(str(dest), "wb") as f:
            await f.write(compressed_content)
            
    except Exception as e:
        # En cas d'erreur avec Pillow, on sauvegarde le fichier original
        ext = Path(file.filename).suffix.lower()
        filename = f"{uuid.uuid4().hex}{ext}"
        dest = UPLOAD_DIR / filename
        async with aiofiles.open(str(dest), "wb") as f:
            await f.write(content)

    return {"url": f"/uploads/{filename}", "filename": filename}


# ── Catégories (Admin) ───────────────────────────────────────────────────────
@app.post("/api/admin/categories", tags=["Admin — Catégories"])
async def admin_create_category(cat: CategoryCreate, admin=Depends(get_current_admin)):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO categories (name, icon, sort_order) VALUES (?, ?, ?)",
            (cat.name, cat.icon, cat.sort_order)
        )
        conn.commit()
        cat_id = cur.lastrowid
    except Exception:
        conn.close()
        raise HTTPException(status_code=400, detail="Catégorie déjà existante")
    cur.execute("SELECT * FROM categories WHERE id = ?", (cat_id,))
    row = cur.fetchone()
    conn.close()
    return dict(row)


@app.delete("/api/admin/categories/{cat_id}", tags=["Admin — Catégories"])
async def admin_delete_category(cat_id: int, admin=Depends(get_current_admin)):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM categories WHERE id = ?", (cat_id,))
    conn.commit()
    conn.close()
    return {"message": "Catégorie supprimée"}


# ── Paramètres (Admin) ───────────────────────────────────────────────────────
@app.get("/api/admin/settings", tags=["Admin — Paramètres"])
async def admin_get_settings(admin=Depends(get_current_admin)):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT key, value FROM settings")
    rows = cur.fetchall()
    conn.close()
    return {r["key"]: r["value"] for r in rows}


@app.put("/api/admin/settings/{key}", tags=["Admin — Paramètres"])
async def admin_update_setting(key: str, body: SettingUpdate, admin=Depends(get_current_admin)):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)",
        (key, body.value)
    )
    conn.commit()
    conn.close()
    return {"key": key, "value": body.value}


# ── Gestion des admins ───────────────────────────────────────────────────────
@app.get("/api/admin/admins", tags=["Admin — Gestion"])
async def admin_list_admins(admin=Depends(get_current_admin)):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, email, name, role, created_at FROM admins ORDER BY created_at")
    rows = cur.fetchall()
    conn.close()
    return [dict(r) for r in rows]


@app.post("/api/admin/admins", status_code=201, tags=["Admin — Gestion"])
async def admin_create_admin(body: AdminCreate, admin=Depends(get_current_admin)):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO admins (email, password, name) VALUES (?, ?, ?)",
            (body.email, hash_password(body.password), body.name)
        )
        conn.commit()
        new_id = cur.lastrowid
    except Exception:
        conn.close()
        raise HTTPException(status_code=400, detail="Email déjà utilisé")
    cur.execute("SELECT id, email, name, role, created_at FROM admins WHERE id = ?", (new_id,))
    row = cur.fetchone()
    conn.close()
    return dict(row)


@app.delete("/api/admin/admins/{admin_id}", tags=["Admin — Gestion"])
async def admin_delete_admin(admin_id: int, admin=Depends(get_current_admin)):
    if admin["id"] == admin_id:
        raise HTTPException(status_code=400, detail="Impossible de supprimer votre propre compte")
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM admins WHERE id = ?", (admin_id,))
    conn.commit()
    conn.close()
    return {"message": "Admin supprimé"}


# ── Statistiques ─────────────────────────────────────────────────────────────
@app.get("/api/admin/stats", tags=["Admin — Stats"])
async def admin_stats(admin=Depends(get_current_admin)):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT COUNT(*) as total FROM products")
    total = cur.fetchone()["total"]

    cur.execute("SELECT COUNT(*) as available FROM products WHERE is_available = 1")
    available = cur.fetchone()["available"]

    cur.execute("SELECT category, COUNT(*) as count FROM products GROUP BY category ORDER BY count DESC")
    by_category = {r["category"]: r["count"] for r in cur.fetchall()}

    cur.execute("SELECT COUNT(*) as total FROM categories")
    total_categories = cur.fetchone()["total"]

    conn.close()
    return {
        "total_products": total,
        "available_products": available,
        "unavailable_products": total - available,
        "total_categories": total_categories,
        "by_category": by_category,
    }


# ── Galerie Photos ───────────────────────────────────────────────────────────
@app.get("/api/gallery", tags=["Galerie Publique"])
async def public_gallery():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM gallery ORDER BY created_at DESC")
    rows = cur.fetchall()
    conn.close()
    return [dict(r) for r in rows]


@app.post("/api/admin/gallery", status_code=201, tags=["Admin — Galerie"])
async def admin_create_gallery_item(item: GalleryCreate, admin=Depends(get_current_admin)):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO gallery (title, category, image_url) VALUES (?, ?, ?)",
        (item.title, item.category, item.image_url)
    )
    conn.commit()
    new_id = cur.lastrowid
    cur.execute("SELECT * FROM gallery WHERE id = ?", (new_id,))
    row = cur.fetchone()
    conn.close()
    return dict(row)


@app.delete("/api/admin/gallery/{item_id}", tags=["Admin — Galerie"])
async def admin_delete_gallery_item(item_id: int, admin=Depends(get_current_admin)):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM gallery WHERE id = ?", (item_id,))
    conn.commit()
    conn.close()
    return {"message": "Image de galerie supprimée"}


# ── Statistiques de Commandes (Admin) ────────────────────────────────────────
@app.get("/api/admin/orders/stats", tags=["Admin — Stats"])
async def admin_order_stats(admin=Depends(get_current_admin)):
    conn = get_connection()
    cur = conn.cursor()
    
    # Total clics
    cur.execute("SELECT COUNT(*) as total FROM orders")
    total = cur.fetchone()["total"]
    
    # Clics par catégorie
    cur.execute("SELECT category, COUNT(*) as count FROM orders GROUP BY category")
    by_category = {r["category"]: r["count"] for r in cur.fetchall()}
    
    # Top 5 produits
    cur.execute("SELECT product_name, COUNT(*) as count FROM orders GROUP BY product_name ORDER BY count DESC LIMIT 5")
    top_products = [{"name": r["product_name"], "count": r["count"]} for r in cur.fetchall()]
    
    # Clics par jour (7 derniers jours)
    cur.execute("SELECT date(created_at) as day, COUNT(*) as count FROM orders GROUP BY day ORDER BY day DESC LIMIT 7")
    daily = [{"day": r["day"], "count": r["count"]} for r in cur.fetchall()]
    
    conn.close()
    return {
        "total_orders": total,
        "by_category": by_category,
        "top_products": top_products,
        "daily_stats": daily
    }


@app.delete("/api/admin/orders/stats/reset", tags=["Admin — Stats"])
async def admin_reset_order_stats(admin=Depends(get_current_admin)):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM orders")
    conn.commit()
    conn.close()
    return {"message": "Statistiques de commandes réinitialisées avec succès"}


# ── Panel Admin (HTML) ───────────────────────────────────────────────────────
@app.get("/admin", response_class=HTMLResponse, include_in_schema=False)
@app.get("/admin/", response_class=HTMLResponse, include_in_schema=False)
async def admin_panel():
    """Sert le panel admin HTML."""
    html_path = STATIC_DIR / "admin.html"
    if html_path.exists():
        async with aiofiles.open(str(html_path), "r", encoding="utf-8") as f:
            return HTMLResponse(content=await f.read())
    return HTMLResponse(content="<h1>Panel admin introuvable. Vérifiez static/admin.html</h1>", status_code=404)


# ── Démarrage ────────────────────────────────────────────────────────────────
@app.on_event("startup")
async def startup():
    init_db()
    ensure_default_admin()
    print("=" * 50)
    print("  Production Lakay API - demarre OK")
    print(f"  Panel Admin : http://localhost:8000/admin")
    print(f"  Docs API    : http://localhost:8000/docs")
    print("=" * 50)
