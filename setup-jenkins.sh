#!/bin/bash

# Script de configuración inicial para Jenkins
echo "🔧 Configurando Jenkins para Pokedex PWA..."

# Verificar que Jenkins esté corriendo
if ! curl -s http://localhost:8090 > /dev/null; then
    echo "❌ Error: Jenkins no está corriendo en puerto 8090"
    echo "Ejecuta: docker-compose up -d jenkins"
    exit 1
fi

# Configuración inicial de Jenkins
echo "📋 Pasos de configuración manual en Jenkins:"
echo ""
echo "1. 🌐 Abrir Jenkins: http://localhost:8090"
echo "2. 🔐 Obtener password inicial:"
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword

echo ""
echo "3. 🔌 Instalar plugins requeridos:"
echo "   - NodeJS Plugin"
echo "   - SonarQube Scanner Plugin"
echo "   - Vercel Plugin (o Generic Webhook)"
echo "   - Pipeline Plugin"
echo "   - Git Plugin"
echo ""
echo "4. 🛠️ Configurar herramientas globales:"
echo "   - NodeJS (versión 18.x)"
echo "   - SonarQube Scanner"
echo ""
echo "5. 🔑 Configurar credenciales:"
echo "   - GitHub Token (para clonar repo)"
echo "   - Vercel Token (para despliegue)"
echo "   - SonarQube Token"
echo ""
echo "6. 📁 Crear Pipeline Job:"
echo "   - Nuevo Item > Pipeline"
echo "   - Nombre: 'pokedex-pwa-pipeline'"
echo "   - Pipeline script from SCM"
echo "   - Repository URL: [tu-repositorio-git]"
echo ""

echo "✅ Configuración completada. Continúa en Jenkins web interface."