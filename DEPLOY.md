# 🚀 Guía de Despliegue - Pokedex PWA

## Opciones de Despliegue

### 1. 🐳 Despliegue con Docker (Recomendado)

#### Opción A: Script Automatizado
```bash
./deploy.sh
```

#### Opción B: Comandos Manuales
```bash
# Construir imagen
docker build -t pokedex-pwa:latest .

# Ejecutar contenedor
docker run -d \
    --name pokedex-pwa \
    --restart unless-stopped \
    -p 3000:80 \
    pokedex-pwa:latest
```

**URL:** http://localhost:3000

### 2. 🐙 Docker Compose (Stack Completo)

```bash
# Levantar stack completo (PWA + Jenkins + SonarQube)
docker-compose up -d

# Solo la PWA
docker-compose up -d pokedex-pwa
```

**URLs:**
- **PWA:** http://localhost:3000
- **Jenkins:** http://localhost:8080  
- **SonarQube:** http://localhost:9000

### 3. 📦 Despliegue Estático

```bash
# Build de producción
npm run build

# Servir archivos estáticos (dist/)
npx serve dist -p 3000
```

### 4. ☁️ Despliegue en la Nube

#### Vercel
```bash
npm install -g vercel
vercel --prod
```

#### Netlify
```bash
npm run build
# Subir carpeta dist/ a Netlify
```

#### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## Verificación del Despliegue

### ✅ Checklist Post-Despliegue

- [ ] **PWA Funcional:** La aplicación carga correctamente
- [ ] **Pokemon Cargados:** Lista de 30+ Pokemon visible
- [ ] **Modal Funcional:** Clic en Pokemon abre estadísticas
- [ ] **Responsive:** Se adapta a móvil/tablet/desktop  
- [ ] **PWA Installable:** Aparece opción de instalación
- [ ] **Offline:** Funciona sin conexión después de la primera visita
- [ ] **Service Worker:** Registrado correctamente
- [ ] **Manifest:** Detectado por el navegador

### 🔍 Tests de Funcionalidad

```bash
# En el navegador:
# 1. Abrir DevTools > Application > Service Workers
# 2. Verificar que el SW está registrado
# 3. Application > Manifest - verificar datos PWA
# 4. Network > Offline - probar funcionalidad offline
# 5. Lighthouse - audit PWA score
```

## Monitoreo y Logs

### Docker Logs
```bash
# Ver logs en tiempo real
docker logs -f pokedex-pwa

# Logs de arranque
docker logs pokedex-pwa

# Estado del contenedor
docker ps | grep pokedex-pwa
```

### Nginx Logs (dentro del contenedor)
```bash
# Acceder al contenedor
docker exec -it pokedex-pwa sh

# Ver logs de nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## Troubleshooting

### Problemas Comunes

#### Puerto en Uso
```bash
# Verificar qué proceso usa el puerto 3000
lsof -i :3000

# Cambiar puerto en el comando docker
docker run -p 3001:80 pokedex-pwa:latest
```

#### Service Worker No Se Registra
- Verificar que la aplicación se sirve por HTTPS o localhost
- Limpiar cache del navegador
- Verificar en DevTools > Application > Service Workers

#### PWA No Se Puede Instalar
- Verificar manifest.webmanifest
- Confirmar que está servido por HTTPS o localhost
- Verificar íconos en public/

#### Problemas de CORS con PokeAPI
- PokeAPI permite CORS desde cualquier origen
- Si hay problemas, verificar conexión a internet

### Rebuild y Actualización

```bash
# Parar y remover contenedor
docker stop pokedex-pwa && docker rm pokedex-pwa

# Rebuild con cache limpio
docker build --no-cache -t pokedex-pwa:latest .

# Ejecutar nuevo contenedor
./deploy.sh
```

## Performance

### Métricas Esperadas
- **First Contentful Paint:** < 2s
- **Largest Contentful Paint:** < 3s  
- **Time to Interactive:** < 4s
- **PWA Score:** > 90

### Optimizaciones Aplicadas
- **Code Splitting:** Vite automático
- **Asset Optimization:** Compresión gzip
- **Caching:** Service Worker + nginx headers
- **Image Optimization:** Sprites de PokeAPI optimizados

---

**Deployment Status:** ✅ Ready for Production

*Configuración completa para despliegue seguro y escalable*