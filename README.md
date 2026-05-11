# Django Backend - Admin Lakay

## Installation rapide

```bash
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python manage.py makemigrations && python manage.py migrate
python manage.py createsuperuser && python manage.py runserver
```

## Endpoints API

- `GET /api/products/` - Liste des produits actifs
- `GET /api/gallery/` - Liste des images galerie actives
- `/admin/` - Interface d'administration Django

## Configuration CORS

Origines autorisées : `http://localhost:5173`, `http://127.0.0.1:5173`
