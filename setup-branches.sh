#!/bin/bash

# Script para configurar el entorno de desarrollo con ramas según especificaciones
# FASE 3: Configuración del Pipeline - Gestión de Ramas

echo "🔧 Configurando entorno DevOps para Pokedx PWA..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Verificar que estamos en un repositorio git
if [ ! -d .git ]; then
    echo "❌ Error: No se encontró repositorio git. Inicializando..."
    git init
    git add .
    git commit -m "🎯 Initial commit - Pokedx PWA DevOps Setup"
fi

# Obtener rama actual
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Rama actual: $CURRENT_BRANCH"

# Crear rama develop si no existe
if ! git rev-parse --verify develop >/dev/null 2>&1; then
    echo "🌿 Creando rama develop..."
    git checkout -b develop
    git push -u origin develop 2>/dev/null || echo "⚠️  Nota: No se pudo hacer push automático"
else
    echo "✅ Rama develop ya existe"
fi

# Crear rama main si no existe (renombrar master si existe)
if ! git rev-parse --verify main >/dev/null 2>&1; then
    if git rev-parse --verify master >/dev/null 2>&1; then
        echo "🔄 Renombrando rama master a main..."
        git branch -m master main
        git push origin main 2>/dev/null || echo "⚠️  Nota: No se pudo hacer push automático"
        git push origin --delete master 2>/dev/null || echo "⚠️  Nota: No se pudo eliminar rama master remota"
    else
        echo "🌿 Creando rama main..."
        git checkout -b main
        git push -u origin main 2>/dev/null || echo "⚠️  Nota: No se pudo hacer push automático"
    fi
else
    echo "✅ Rama main ya existe"
fi

# Volver a develop para desarrollo
git checkout develop 2>/dev/null || git checkout -b develop

echo ""
echo "📋 CONFIGURACIÓN DE RAMAS COMPLETADA"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌿 develop: Para desarrollo, tests y Quality Gate (NO deploya)"
echo "🌟 main: Para producción (deploya a Vercel después de Quality Gate)"
echo ""

# Mostrar estado actual
echo "🔍 Estado actual del repositorio:"
git status --porcelain

echo ""
echo "📚 PRÓXIMOS PASOS PARA DEMOSTRACIÓN:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  FALLO INTENCIONAL (en develop):"
echo "   - Editar src/test/demo-failure.test.tsx"
echo "   - Descomentar los tests que fallan"
echo "   - Commit y push a develop"
echo "   - ✅ Resultado esperado: Pipeline FALLA en Quality Gate"
echo ""
echo "2️⃣  CORRECCIÓN (en develop):"
echo "   - Comentar nuevamente los tests que fallan"
echo "   - Commit y push a develop"
echo "   - ✅ Resultado esperado: Pipeline PASA pero NO despliega"
echo ""
echo "3️⃣  DESPLIEGUE (main):"
echo "   - Crear PR de develop a main"
echo "   - Merge a main"
echo "   - ✅ Resultado esperado: Pipeline PASA y DESPLIEGA a producción"
echo ""

echo "🎯 ¡Configuración lista para evaluación DevOps!"