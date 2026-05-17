import sqlite3
import os
import shutil
import json
from pathlib import Path

# Config
BASE_DIR = Path(r"c:\Users\HP\Downloads\production-lakay (1)")
SOURCE_DIR = BASE_DIR / "frontend" / "produits"
GAL_SOURCE_DIR = BASE_DIR / "frontend" / "Galerie"
LOGO_SOURCE_DIR = BASE_DIR / "frontend" / "logo"

UPLOAD_BASE = BASE_DIR / "backend" / "uploads"
DB_PATH = BASE_DIR / "backend" / "lakay.db"

def get_sorted_files(directory):
    files = list(directory.glob("*.jpeg")) + list(directory.glob("*.jpg"))
    # Sort naturally: files without (x) suffix first, then by name
    def sort_key(f):
        name = f.name
        has_suffix = "(" in name
        return (has_suffix, name)
    return sorted(files, key=sort_key)

def migrate_products():
    mapping = {
        'cornet-unite': get_sorted_files(SOURCE_DIR / "cornet" / "cornet(unique)"),
        'cornet-boite': get_sorted_files(SOURCE_DIR / "cornet" / "cornet(boite)"),
        'saucisse-enroulee': get_sorted_files(SOURCE_DIR / "saucisse_enroulee"),
        'fresco-artisanal': get_sorted_files(SOURCE_DIR / "Fresco"),
        'jus-cerise': get_sorted_files(SOURCE_DIR / "jus" / "jus_cerise"),
        'jus-citron': get_sorted_files(SOURCE_DIR / "jus" / "jus_citron"),
        'jus-grenadia': get_sorted_files(SOURCE_DIR / "jus" / "jus_grenadia"),
        'jus-mandarine': get_sorted_files(SOURCE_DIR / "jus" / "jus_mandarine"),
        'jus-melon': get_sorted_files(SOURCE_DIR / "jus" / "jus_melon"),
    }
    
    # Specific fix for Fresco: the logoed one is 3.03.11 PM
    fresco_files = mapping['fresco-artisanal']
    logoed_fresco = [f for f in fresco_files if "3.03.11 PM" in f.name]
    if logoed_fresco:
        others = [f for f in fresco_files if f not in logoed_fresco]
        mapping['fresco-artisanal'] = logoed_fresco + others

    conn = sqlite3.connect(str(DB_PATH))
    cur = conn.cursor()
    
    for product_id, files in mapping.items():
        if not files: continue
        product_paths = []
        for i, f in enumerate(files):
            new_name = f"{product_id}_{i}{f.suffix}"
            dest = UPLOAD_BASE / "products" / new_name
            shutil.copy2(f, dest)
            product_paths.append(f"/uploads/products/{new_name}")
        
        main_img = product_paths[0]
        gallery_json = json.dumps(product_paths)
        cur.execute("UPDATE products SET image_url = ?, gallery = ? WHERE id = ?", (main_img, gallery_json, product_id))
        print(f"Product {product_id}: {len(product_paths)} images (Main: {main_img})")
    
    conn.commit()
    conn.close()

if __name__ == "__main__":
    migrate_products()
    print("Priority migration complete!")
