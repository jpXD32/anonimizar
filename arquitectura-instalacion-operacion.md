# Telefonia 360 - Arquitectura e Instalacion

## 1) Objetivo del sistema
Telefonia 360 es un portal web para control operativo de telefonia movil corporativa. Muestra indicadores, tablas y cruces de lineas, equipos, estado Intune, alertas y reportes.

## 2) Componentes del sistema

### Frontend
- Tecnologia: React + Vite + Tailwind.
- Carpeta: `frontend/`.
- Puerto: `5173`.
- Funcion: Interfaz web (dashboard, tablas, filtros, exportaciones).

### Backend API
- Tecnologia: Node.js + Express.
- Carpeta: `backend/`.
- Puerto: `4000`.
- Funcion: Entrega endpoints REST para dashboard, lineas, equipos, Intune, alertas, reportes y exportaciones.

### Base de datos
- Tecnologia objetivo: SQL Server.
- Scripts: `database/`.
- Esquemas esperados por API: `dw`, `stg`, `audit`, `cfg`.
- Base esperada: `Telefonia360`.

### Documentacion
- Carpeta: `docs/`.
- Contiene continuidad, arquitectura funcional y modelo de datos.

## 3) Modos de datos del backend

### Modo mock
- `DATA_SOURCE=mock` en `backend/.env`.
- Usa datos simulados internos.
- Recomendado para validar que frontend/backend levanten sin depender de SQL Server.

### Modo sqlserver
- `DATA_SOURCE=sqlserver` en `backend/.env`.
- Lee datos reales desde SQL Server.
- Requiere servicio SQL levantado, login valido y estructura esperada.

## 4) Servicios y puertos
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`
- Health API: `http://localhost:4000/api/health`

Nota: el endpoint `/api/health` en este proyecto puede mostrar `mode: "mock"` fijo por implementacion actual, aunque el backend este intentando SQL Server.

## 5) Requisitos de instalacion (nuevo PC)

## Sistema operativo
- Windows 10/11 recomendado.

## Runtime y herramientas
- Node.js 20+ (incluye npm).
- Visual C++ Redistributable 2015-2022 x64.
- SQL Server 2019/2022 (si se usara modo real).
- ODBC Driver 17 u 18 for SQL Server.

## Servicios SQL (si modo real)
- `MSSQLSERVER` o `MSSQL$SQLEXPRESS` en `Running`.
- `SQLBrowser` recomendado en `Running` para instancias nombradas.

## 6) Instalacion del proyecto
1. Copiar carpeta completa del proyecto.
2. En raiz del proyecto ejecutar:
   - `instalar-telefonia-360.bat`
   - o manual: `npm run install:all`
3. Revisar `backend/.env`.
4. Iniciar con `iniciar-telefonia-360.bat` o `npm run dev`.

## 7) Configuracion backend/.env

## Inicio rapido estable (sin SQL)
```env
DATA_SOURCE=mock
```

## Datos reales SQL Server
```env
PORT=4000
NODE_ENV=development
FRONTEND_ORIGIN=http://localhost:5173
DATA_SOURCE=sqlserver

SQLSERVER_AUTH=sql
SQLSERVER_DRIVER=ODBC Driver 17 for SQL Server
SQLSERVER_HOST=localhost
SQLSERVER_DATABASE=Telefonia360
SQLSERVER_USER=usuario_sql
SQLSERVER_PASSWORD=clave_sql
SQLSERVER_ENCRYPT=false
SQLSERVER_TRUST_CERT=true
```

Si usan autenticacion Windows:
```env
SQLSERVER_AUTH=windows
```
y no usar `SQLSERVER_USER`/`SQLSERVER_PASSWORD`.

## 8) Validaciones minimas despues de iniciar
1. Abrir `http://localhost:5173`.
2. Probar `http://localhost:4000/api/health`.
3. Probar endpoint de datos:
   - `http://localhost:4000/api/lineas`

Si `/api/lineas` devuelve `500`, el problema suele ser conexion/autenticacion SQL o estructura faltante en DB.

## 9) Fallas frecuentes y causa probable
1. Pantalla "Cargando datos..." indefinida
- API lenta o endpoints sin respuesta.
- SQL no responde o servicio caido.

2. Error `Login failed for user ...` (SQL 18456)
- Usuario/clave incorrectos o login no habilitado.
- Modo de autenticacion no coincide (Windows vs SQL).

3. Error al iniciar SQL `1058`
- Servicio SQL deshabilitado.
- Solucion: habilitar tipo de inicio y levantar servicio.

4. Error ODBC/driver
- Driver SQL no instalado o cadena de conexion invalida.

## 10) Secuencia recomendada de puesta en marcha
1. Levantar en `mock` y validar UI/API.
2. Confirmar SQL Server y credenciales.
3. Cambiar a `sqlserver`.
4. Validar `/api/lineas` y `/api/dashboard/resumen`.
5. Recien ahi validar datos de negocio.

---
Documento creado para onboarding tecnico e instalacion consistente entre equipos.
