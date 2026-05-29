# Anonimizador de Datos v3.2

Herramienta local para anonimizar datos sensibles en archivos CSV/Excel.

## Arquitectura activa

- Frontend: Next.js (`frontend/`) en `http://localhost:3000`
- Backend: Flask (`backend/app.py`) en `http://localhost:5000`
- Motor: `anonymizer.py`

## Inicio rápido

1. Backend:

```bash
python backend/app.py
```

2. Frontend (otra terminal):

```bash
cd frontend
npm run dev
```

3. Abrir:

- App: `http://localhost:3000`
- Health check: `http://localhost:5000/api/health`

## Estructura principal

- `anonymizer.py`: motor de anonimización.
- `backend/app.py`: API REST.
- `frontend/`: UI web.
- `scripts/`: utilidades CLI y checks.

## Notas

- Proyecto 100% local (sin envío a nube).
- Stack activo: Next.js + Flask.
