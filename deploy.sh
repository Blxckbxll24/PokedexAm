#!/bin/bash

# Script de despliegue para Pokedex PWA
echo "🚀 Iniciando despliegue de Pokedex PWA..."

# Verificar que Docker esté corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker no está corriendo"
    exit 1
fi

# Construir la imagen
echo "🔨 Construyendo imagen Docker..."
docker build -t pokedex-pwa:latest .

if [ $? -ne 0 ]; then
    echo "❌ Error al construir la imagen"
    exit 1
fi

# Detener contenedor existente si está corriendo
echo "🛑 Deteniendo contenedor existente..."
docker stop pokedex-pwa 2>/dev/null || true
docker rm pokedex-pwa 2>/dev/null || true

# Ejecutar el nuevo contenedor
echo "▶️ Iniciando nueva instancia..."
docker run -d \
    --name pokedex-pwa \
    --restart unless-stopped \
    -p 3000:80 \
    -e NODE_ENV=production \
    pokedex-pwa:latest

if [ $? -eq 0 ]; then
    echo "✅ Despliegue exitoso!"
    echo "🌐 Aplicación disponible en: http://localhost:3000"
    echo "📱 PWA lista para instalar"
    
    # Mostrar estado del contenedor
    echo ""
    echo "📊 Estado del contenedor:"
    docker ps | grep pokedex-pwa
    
    # Mostrar logs iniciales
    echo ""
    echo "📝 Logs iniciales:"
    docker logs pokedex-pwa
else
    echo "❌ Error al iniciar el contenedor"
    exit 1
fi

echo ""
echo "🛠️ Comandos útiles:"
echo "  Ver logs:     docker logs -f pokedex-pwa"
echo "  Detener:      docker stop pokedex-pwa"
echo "  Reiniciar:    docker restart pokedex-pwa"
echo "  Eliminar:     docker rm -f pokedex-pwa"