# Integración con Sistema VPN2

Si deseas integrar este anonimizador con tu proyecto principal VPN2, aquí hay algunas opciones:

## Opción 1: Módulo Independiente (Recomendado)

Mantén `anonimizar/` como proyecto separado:

```
C:\Proyectos\
├── sistema-vpn2/        (tu proyecto principal)
└── anonimizar/          (este proyecto)
```

**Ventajas:**
- Separación de responsabilidades
- Fácil de mantener y actualizar
- Puede usarse con otros proyectos

**Uso:**
```bash
# Desde VPN2, anonimizar datos generados
python ../anonimizar/anonymizer.py datos_vpn2.csv
```

---

## Opción 2: Submódulo en VPN2

Si quieres incluirlo en VPN2:

```bash
cd C:\Proyectos\sistema-vpn2
mkdir tools
cp -r ../anonimizar/* tools/anonimizar/
```

Estructura resultante:
```
sistema-vpn2/
├── backend/
├── frontend/
└── tools/
    └── anonimizar/
        ├── anonymizer.py
        ├── README.md
        └── ...
```

---

## Opción 3: Integración con Backend VPN2

Si tu backend Node.js genera reportes:

### Paso 1: Crear endpoint de exportación anonimizada

```javascript
// backend/server.js
const { spawn } = require('child_process');

app.post('/api/export/anonymized', (req, res) => {
  const { dataFile } = req.body;
  
  // Ejecutar anonimizador
  const python = spawn('python', ['../anonimizar/anonymizer.py', dataFile]);
  
  python.on('close', (code) => {
    res.download(`${dataFile}_anonymized.csv`);
  });
});
```

### Paso 2: Desde frontend, pedir exportación anonimizada

```typescript
// frontend/src/api.ts
async function exportAnonymized() {
  const response = await fetch('/api/export/anonymized', {
    method: 'POST',
    body: JSON.stringify({ dataFile: 'current_data.csv' })
  });
  // Descargar archivo anonimizado
}
```

---

## Opción 4: Datos Sensibles de VPN2

Si tienes datos sensibles en VPN2 (nombres de usuarios, IPs, ubicaciones):

### Anonimizar logs de auditoría

```bash
python ../anonimizar/anonymizer.py backend/data/audit-events.json \
  -c usuario,ip_origen,ubicacion
```

### Anonimizar datos de usuarios para testing

```bash
python ../anonimizar/anonymizer.py backend/data/portal-state.json \
  -c nombre,apellido,email,telefono
```

---

## Paso a Paso de Integración

### 1. Copiar proyecto (si deseas usarlo en VPN2)

```bash
cp -r C:\Proyectos\anonimizar C:\Proyectos\sistema-vpn2\tools\
```

### 2. Instalar dependencias en VPN2

```bash
cd C:\Proyectos\sistema-vpn2\tools\anonimizar
pip install -r requirements.txt
```

### 3. Crear script de anonimización para VPN2

```bash
# C:\Proyectos\sistema-vpn2\tools\anonymize_portal.sh

#!/bin/bash
cd "$(dirname "$0")/anonimizar"

echo "[*] Anonimizando datos del portal VPN2..."

python anonymizer.py \
  ../../../backend/data/portal-state.json \
  ../../../backend/data/portal-state-anonymized.json \
  -c usuarios,ubicaciones,ips
```

### 4. Ejecutar cuando sea necesario

```bash
# Antes de compartir datos con stakeholders
bash C:\Proyectos\sistema-vpn2\tools\anonymize_portal.sh
```

---

## Ejemplo: Anonimizar datos de VPN2

### Paso 1: Exportar datos de VPN2

```bash
# Desde tu backend VPN2
node backend/server.js &
curl http://localhost:3000/api/export/full > vpn2_data.json
```

### Paso 2: Convertir a CSV (si es necesario)

```bash
# Si tienes JSON, convertir con jq o Python
python -c "import json,csv; data=json.load(open('vpn2_data.json')); ..."
```

### Paso 3: Anonimizar

```bash
python ../anonimizar/anonymizer.py vpn2_data.csv \
  -c nombre_usuario,ubicacion,email,telefono
```

### Paso 4: Compartir de forma segura

```bash
# Enviar solo el CSV anonimizado
# NO enviar los mapeos
```

---

## Flujo Completo Recomendado

```
VPN2 genera datos
    ↓
Exportar a CSV/JSON
    ↓
Ejecutar anonimizador
    ↓
Verificar resultado
    ↓
Compartir datos anonimizados
```

---

## Variables de Entorno (Opcional)

Si integras con VPN2, puedes usar `.env`:

```bash
# .env en VPN2
ANONYMIZER_PATH="../anonimizar/anonymizer.py"
ANONYMIZER_COLUMNS="nombre,email,rut,ubicacion"
ANONYMIZER_SAVE_MAPPING=true
```

Luego en tu código:

```javascript
const columns = process.env.ANONYMIZER_COLUMNS.split(',');
```

---

## Seguridad: Consideraciones para VPN2

⚠️ **IMPORTANTE:**

1. **Nunca expongas los mapeos** públicamente
   - Si integras con API, protege el endpoint de mapeos
   - Require autenticación para acceder a `*_mappings.json`

2. **Anonimiza antes de enviar a terceros**
   - Dev/Test: anonimiza datos sensibles
   - Producción: mantén datos originales con acceso limitado

3. **Auditoria**
   - Registra cuándo se anonimiza
   - Registra quién descarga datos anonimizados

---

## Preguntas Frecuentes

### ¿Puedo anonimizar datos de producción VPN2?

Sí, pero:
1. **Antes de anonimizar, haz backup** de los datos originales
2. Anonimiza una **copia**, no los datos originales
3. Guarda los **mapeos en lugar seguro**

### ¿Cómo anonimizar de forma segura?

```bash
# 1. Backup
cp backend/data/portal-state.json backend/data/portal-state.backup.json

# 2. Anonimizar en copia
cp backend/data/portal-state.json backup_temporal.json
python ../anonimizar/anonymizer.py backup_temporal.json

# 3. Verificar resultado
head -5 backup_temporal_anonymized.json

# 4. Limpiar
rm backup_temporal.json backup_temporal_anonymized_mappings.json
```

### ¿Debo commitear los mapeos?

**No.**

Añade a `.gitignore` de VPN2:
```bash
echo "*_mappings.json" >> .gitignore
echo "*_anonymized.*" >> .gitignore
```

---

## Siguiente Paso

Elige una opción y contacta si necesitas ayuda integrando.

Recomendación: **Opción 1 (Módulo Independiente)** - Más segura y mantenible.
