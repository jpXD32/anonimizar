#!/bin/bash

# 🚀 SCRIPT ROBUSTO PARA INICIAR SERVICIOS
# Monitorea y reinicia automáticamente si se caen

set -e
cd /c/Proyectos/anonimizar

echo "╔════════════════════════════════════════════════╗"
echo "║     INICIANDO SERVICIOS (MODO ROBUSTO)        ║"
echo "╚════════════════════════════════════════════════╝"

# 1. Detener servicios anteriores
echo "🛑 Deteniendo servicios anteriores..."
taskkill /F /IM python.exe 2>/dev/null || true
taskkill /F /IM node.exe 2>/dev/null || true
sleep 3

# 2. Iniciar Backend (Flask)
echo "🚀 Iniciando Backend (Flask)..."
python backend/app.py > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "   PID: $BACKEND_PID"
sleep 3

# 3. Verificar Backend
echo "🔍 Verificando Backend..."
for i in {1..5}; do
  if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "   ✅ Backend respondiendo en puerto 5000"
    break
  fi
  echo "   ⏳ Intento $i/5..."
  sleep 1
done

# 4. Iniciar Frontend (Next.js)
echo "🚀 Iniciando Frontend (Next.js)..."
cd frontend && npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   PID: $FRONTEND_PID"
sleep 10

# 5. Verificar Frontend
echo "🔍 Verificando Frontend..."
for i in {1..5}; do
  if curl -s http://localhost:3007 > /dev/null 2>&1; then
    echo "   ✅ Frontend respondiendo en puerto 3007"
    break
  fi
  echo "   ⏳ Intento $i/5..."
  sleep 2
done

echo ""
echo "╔════════════════════════════════════════════════╗"
echo "║         ✅ SERVICIOS INICIADOS                ║"
echo "╚════════════════════════════════════════════════╝"
echo ""
echo "📍 Acceso:"
echo "   Frontend: http://localhost:3007"
echo "   Backend:  http://localhost:5000/api/health"
echo ""
echo "📊 Logs:"
echo "   Backend: tail -f /tmp/backend.log"
echo "   Frontend: tail -f /tmp/frontend.log"
echo ""
echo "⏸️  Para detener: Presiona Ctrl+C"
echo ""

# 6. Monitor continuo - reinicia si se cae
while true; do
  sleep 10
  
  # Verificar Backend
  if ! curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "⚠️  Backend no responde. Reiniciando..."
    taskkill /F /IM python.exe 2>/dev/null || true
    sleep 2
    python backend/app.py > /tmp/backend.log 2>&1 &
    BACKEND_PID=$!
    sleep 3
    echo "✅ Backend reiniciado (PID: $BACKEND_PID)"
  fi
  
  # Verificar Frontend
  if ! curl -s http://localhost:3007 > /dev/null 2>&1; then
    echo "⚠️  Frontend no responde. Reiniciando..."
    taskkill /F /IM node.exe 2>/dev/null || true
    sleep 2
    cd frontend && npm run dev > /tmp/frontend.log 2>&1 &
    FRONTEND_PID=$!
    sleep 5
    echo "✅ Frontend reiniciado (PID: $FRONTEND_PID)"
  fi
done
