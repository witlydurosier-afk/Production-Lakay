"""
database.py — Gestion de la base de données SQLite pour Production Lakay
"""
import sqlite3
import json
import os
from pathlib import Path

DB_PATH = Path(__file__).parent / "lakay.db"


def get_connection():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db():
    """Initialise les tables et insère l'admin par défaut."""
    conn = get_connection()
    cur = conn.cursor()

    # Table des admins
    cur.execute("""
        CREATE TABLE IF NOT EXISTS admins (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            email     TEXT UNIQUE NOT NULL,
            password  TEXT NOT NULL,
            name      TEXT NOT NULL DEFAULT 'Administrateur',
            role      TEXT NOT NULL DEFAULT 'admin',
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
    """)

    # Table des produits
    cur.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id          TEXT PRIMARY KEY,
            name        TEXT NOT NULL,
            description TEXT,
            price       REAL,
            prices      TEXT,          -- JSON: [{"label": "Small", "value": 150}]
            category    TEXT NOT NULL,
            unit        TEXT,
            image_url   TEXT,
            gallery     TEXT,          -- JSON: ["url1", "url2"]
            is_available INTEGER NOT NULL DEFAULT 1,
            created_at  TEXT NOT NULL DEFAULT (datetime('now')),
            updated_at  TEXT
        )
    """)

    # Table des catégories
    cur.execute("""
        CREATE TABLE IF NOT EXISTS categories (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            name       TEXT UNIQUE NOT NULL,
            icon       TEXT,
            sort_order INTEGER NOT NULL DEFAULT 0
        )
    """)

    # Table pour la galerie photo
    cur.execute("""
        CREATE TABLE IF NOT EXISTS gallery (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            title      TEXT NOT NULL,
            category   TEXT NOT NULL,
            image_url  TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
    """)

    # Table des statistiques de clics (commandes simulées)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id  TEXT NOT NULL,
            product_name TEXT NOT NULL,
            category    TEXT NOT NULL,
            price       REAL,
            created_at  TEXT NOT NULL DEFAULT (datetime('now')),
            FOREIGN KEY (product_id) REFERENCES products (id)
        )
    """)

    # Table des paramètres du site
    cur.execute("""
        CREATE TABLE IF NOT EXISTS settings (
            key   TEXT PRIMARY KEY,
            value TEXT NOT NULL
        )
    """)

    # Catégories par défaut
    default_categories = [
        ("Cornet", "🌽", 1),
        ("Saucisse", "🌭", 2),
        ("Fresco", "🧊", 3),
        ("Jus Naturel", "🥤", 4),
    ]
    cur.executemany(
        "INSERT OR IGNORE INTO categories (name, icon, sort_order) VALUES (?, ?, ?)",
        default_categories
    )

    # Paramètres par défaut
    default_settings = [
        ("site_name", "Production Lakay"),
        ("site_phone", "+509 XXXX XXXX"),
        ("site_email", "contact@productionlakay.ht"),
        ("site_address", "Port-au-Prince, Haïti"),
        ("delivery_note", "Livraison disponible sur Port-au-Prince"),
        ("whatsapp_number", "50900000000"),
        ("maintenance_mode", "false"),
        ("hero_image_url", "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000&auto=format&fit=crop"),
        ("about_hero_image_url", "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2000&auto=format&fit=crop"),
        ("hero_secondary_image_url", "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=1000&auto=format&fit=crop"),
    ]
    cur.executemany(
        "INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)",
        default_settings
    )

    # Produits initiaux
    initial_products = [
        {
            "id": "cornet-unite",
            "name": "Cornet (Unité)",
            "description": "Cornet artisanal croustillant, préparé avec soin pour une pause gourmande simple, fraîche et authentique.",
            "price": 100.0,
            "prices": None,
            "category": "Cornet",
            "unit": "unité",
            "image_url": None,
            "gallery": None,
        },
        {
            "id": "cornet-boite",
            "name": "Cornet (Boîte)",
            "description": "Une boîte généreuse de cornets maison, idéale pour partager en famille, au bureau ou pendant un événement.",
            "price": 550.0,
            "prices": None,
            "category": "Cornet",
            "unit": "boîte",
            "image_url": None,
            "gallery": None,
        },
        {
            "id": "saucisse-enroulee",
            "name": "Saucisse enroulée",
            "description": "Saucisse savoureuse enroulée dans une pâte dorée, pratique pour les petites faims.",
            "price": None,
            "prices": json.dumps([{"label": "Unité", "value": 100}, {"label": "Boîte", "value": 550}]),
            "category": "Saucisse",
            "unit": None,
            "image_url": None,
            "gallery": None,
        },
        {
            "id": "fresco-artisanal",
            "name": "Fresco Artisanal",
            "description": "Fresco glacé aux sirops maison, préparé pour apporter une vraie fraîcheur locale.",
            "price": None,
            "prices": json.dumps([{"label": "Cup 150", "value": 150}, {"label": "Cup 200", "value": 200}]),
            "category": "Fresco",
            "unit": None,
            "image_url": None,
            "gallery": None,
        },
        {
            "id": "jus-melon",
            "name": "Jus Melon",
            "description": "Jus naturel de melon, doux et rafraîchissant, préparé avec des fruits frais.",
            "price": None,
            "prices": json.dumps([{"label": "Cup 250", "value": 250}, {"label": "Cup 300", "value": 300}, {"label": "Cup 350", "value": 350}]),
            "category": "Jus Naturel",
            "unit": None,
            "image_url": None,
            "gallery": None,
        },
        {
            "id": "jus-cerise",
            "name": "Jus Cerise",
            "description": "Jus naturel de cerise, fruité et généreux, parfait pour accompagner vos repas.",
            "price": None,
            "prices": json.dumps([{"label": "Cup 250", "value": 250}, {"label": "Cup 300", "value": 300}, {"label": "Cup 350", "value": 350}]),
            "category": "Jus Naturel",
            "unit": None,
            "image_url": None,
            "gallery": None,
        },
        {
            "id": "jus-grenadia",
            "name": "Jus Grenadia",
            "description": "Jus naturel Grenadia, parfumé et tropical, avec une belle intensité de fruit frais.",
            "price": None,
            "prices": json.dumps([{"label": "Cup 250", "value": 250}, {"label": "Cup 300", "value": 300}, {"label": "Cup 350", "value": 350}]),
            "category": "Jus Naturel",
            "unit": None,
            "image_url": None,
            "gallery": None,
        },
        {
            "id": "jus-mandarine",
            "name": "Jus Mandarine",
            "description": "Jus naturel de mandarine, vif et équilibré, pressé pour garder un goût net et très frais.",
            "price": None,
            "prices": json.dumps([{"label": "Cup 250", "value": 250}, {"label": "Cup 300", "value": 300}, {"label": "Cup 350", "value": 350}]),
            "category": "Jus Naturel",
            "unit": None,
            "image_url": None,
            "gallery": None,
        },
        {
            "id": "jus-citron",
            "name": "Jus Citron",
            "description": "Jus naturel de citron, frais et tonique, idéal pour une boisson vive et désaltérante.",
            "price": None,
            "prices": json.dumps([{"label": "Cup 250", "value": 250}, {"label": "Cup 300", "value": 300}, {"label": "Cup 350", "value": 350}]),
            "category": "Jus Naturel",
            "unit": None,
            "image_url": None,
            "gallery": None,
        },
    ]

    for p in initial_products:
        cur.execute("""
            INSERT OR IGNORE INTO products
                (id, name, description, price, prices, category, unit, image_url, gallery)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            p["id"], p["name"], p["description"], p["price"],
            p["prices"], p["category"], p["unit"],
            p["image_url"], p["gallery"]
        ))

    conn.commit()
    conn.close()
    print("[DB] Base de donnees initialisee OK")
