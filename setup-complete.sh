#!/bin/bash

# 🚀 CONFIGURACIÓN COMPLETA DEVOPS - POKEDX PWA
# Script para inicializar todo el entorno de evaluación

set -e

echo "🎯 INICIANDO CONFIGURACIÓN DEVOPS COMPLETA"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Función para mostrar pasos
show_step() {
    echo ""
    echo "📋 $1"
    echo "─────────────────────────────────────────────────"
}

# Paso 1: Configurar Git y ramas
show_step "1. CONFIGURANDO REPOSITORIO GIT"

# Inicializar git si no existe
if [ ! -d .git ]; then
    git init
    echo "✅ Repositorio git inicializado"
fi

# Configurar usuario git si no está configurado
if [ -z "$(git config user.name)" ]; then
    git config user.name "DevOps Evaluator"
    git config user.email "devops@pokedx-pwa.com"
    echo "✅ Usuario git configurado"
fi

# Agregar todos los archivos
git add .
if git diff --staged --quiet; then
    echo "✅ No hay cambios pendientes"
else
    git commit -m "🎯 DevOps Setup Complete - Ready for Pipeline Evaluation"
    echo "✅ Commit inicial creado"
fi

# Crear rama develop si no existe
if ! git show-ref --verify --quiet refs/heads/develop; then
    git checkout -b develop
    git push origin develop 2>/dev/null || echo "⚠️  Push manual requerido"
    echo "✅ Rama develop creada"
else
    echo "✅ Rama develop ya existe"
fi

# Asegurar que tenemos rama main
if ! git show-ref --verify --quiet refs/heads/main; then
    if git show-ref --verify --quiet refs/heads/master; then
        git branch -m master main
        echo "✅ Rama master renombrada a main"
    else
        git checkout -b main
        echo "✅ Rama main creada"
    fi
fi

git checkout develop

# Paso 2: Verificar dependencias
show_step "2. VERIFICANDO DEPENDENCIAS"

echo "📦 Instalando dependencias de Node.js..."
npm ci --silent

echo "🧪 Verificando tests..."
npm run test:run --silent

echo "🏗️ Verificando build..."
npm run build --silent
echo "✅ Build exitoso"

# Paso 3: Configurar Docker Stack
show_step "3. CONFIGURANDO STACK DOCKER"

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Instala Docker Desktop primero."
    exit 1
fi

if ! docker info &> /dev/null; then
    echo "❌ Docker no está ejecutándose. Inicia Docker Desktop primero."
    exit 1
fi

echo "🐳 Iniciando stack Docker (Jenkins + SonarQube)..."
docker-compose down --remove-orphans 2>/dev/null || true
docker-compose up -d jenkins sonarqube

# Esperar a que Jenkins esté listo
echo "⏳ Esperando a que Jenkins se inicie..."
timeout=120
counter=0
while ! docker exec jenkins curl -sf http://localhost:8080/login >/dev/null 2>&1; do
    if [ $counter -ge $timeout ]; then
        echo "❌ Timeout esperando Jenkins"
        exit 1
    fi
    sleep 2
    counter=$((counter + 2))
    echo -n "."
done
echo ""
echo "✅ Jenkins está listo"

# Paso 4: Obtener credenciales
show_step "4. OBTENIENDO CREDENCIALES"

echo "🔑 Obteniendo password inicial de Jenkins..."
JENKINS_PASSWORD=$(docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword 2>/dev/null || echo "No disponible")

# Paso 5: Configurar Vercel (opcional)
show_step "5. CONFIGURACIÓN VERCEL (OPCIONAL)"

echo "📋 Para configurar Vercel:"
echo "1. Instalar Vercel CLI: npm i -g vercel"
echo "2. Login: vercel login"
echo "3. Link project: vercel link"
echo "4. Obtener IDs del archivo .vercel/project.json"

# Verificar si Vercel CLI está disponible
if command -v vercel &> /dev/null; then
    echo "✅ Vercel CLI está instalado"
    
    # Intentar obtener información del proyecto
    if [ -f .vercel/project.json ]; then
        echo "✅ Proyecto Vercel ya configurado"
        cat .vercel/project.json
    else
        echo "⚠️  Ejecuta 'vercel link' para configurar el proyecto"
    fi
else
    echo "⚠️  Instala Vercel CLI: npm i -g vercel"
fi

# Paso 6: Resumen final
show_step "6. RESUMEN DE CONFIGURACIÓN"

echo "🌐 URLs de servicios:"
echo "   📊 Jenkins: http://localhost:8080"
echo "   📈 SonarQube: http://localhost:9000"
echo ""
echo "🔑 Credenciales Jenkins:"
echo "   👤 Usuario: admin"
echo "   🔒 Password: $JENKINS_PASSWORD"
echo ""
echo "🎯 CONFIGURACIÓN JENKINS REQUERIDA:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Acceder a Jenkins (http://localhost:8080)"
echo "2. Completar setup inicial con password: $JENKINS_PASSWORD"
echo "3. Instalar plugins sugeridos"
echo "4. Configurar credenciales en Jenkins:"
echo "   - vercel-token (String): Tu token de Vercel"
echo "   - vercel-org-id (String): Tu Organization ID"
echo "   - vercel-project-id (String): Tu Project ID"
echo "   - sonarqube-token (String): Token de SonarQube (generar en SQ)"
echo "5. Configurar SonarQube Server en Jenkins:"
echo "   - Name: SonarQube"
echo "   - Server URL: http://sonarqube:9000"
echo "   - Token: usar credencial sonarqube-token"
echo ""
echo "📊 CONFIGURACIÓN SONARQUBE:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Acceder a SonarQube (http://localhost:9000)"
echo "2. Login inicial: admin/admin (cambiar password)"
echo "3. Crear proyecto 'pokedx-pwa'"
echo "4. Generar token para Jenkins"
echo "5. Configurar Quality Gate estricto (ver quality-gate-config.txt)"
echo ""
echo "🎭 DEMOSTRACIÓN PIPELINE:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Para FALLO INTENCIONAL:"
echo "   - Editar src/test/demo-failure.test.tsx"
echo "   - Descomentar tests que fallan"
echo "   - git commit -m '❌ Demo failure' && git push origin develop"
echo ""
echo "2. Para ÉXITO SIN DEPLOY:"
echo "   - Comentar tests que fallan"
echo "   - git commit -m '✅ Fix demo' && git push origin develop"
echo ""
echo "3. Para DEPLOY A PRODUCCIÓN:"
echo "   - git checkout main && git merge develop"
echo "   - git push origin main"
echo ""

echo "🎯 ¡CONFIGURACIÓN COMPLETADA!"
echo "📖 Ver docs/EVALUATION-GUIDE.md para instrucciones detalladas"
echo ""

# Mostrar siguiente paso
echo "🚀 PRÓXIMO PASO:"
echo "   Configurar Jenkins en: http://localhost:8080"
echo "   Password: $JENKINS_PASSWORD"