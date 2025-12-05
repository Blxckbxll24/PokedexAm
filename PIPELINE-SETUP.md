# 🚀 Configuración de Pipeline DevOps - Pokedex PWA

## Flujo de Despliegue Completo

### 📋 Arquitectura del Pipeline

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Git Commit    │ ─► │    Jenkins      │ ─► │   SonarQube     │ ─► │     Vercel      │
│                 │    │   Pipeline      │    │ Quality Gate    │    │   Deployment    │
│ main/develop    │    │                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 🔧 Stack de Herramientas

| Herramienta | Puerto | Función | Status |
|------------|---------|---------|---------|
| **Jenkins** | 8090 | CI/CD Pipeline | ✅ Configurado |
| **SonarQube** | 9000 | Code Quality | ✅ Configurado |  
| **Vercel** | - | Production Hosting | 🔧 Pendiente |
| **Docker** | 3000 | Local Container | ✅ Funcionando |

## 🎯 Configuración Jenkins

### 1. Acceso Inicial
```bash
# Ejecutar configuración automática
./setup-jenkins.sh

# URL: http://localhost:8090
# Password inicial se muestra en el script
```

### 2. Plugins Requeridos
- **NodeJS Plugin** - Gestión de Node.js
- **SonarQube Scanner** - Análisis de calidad
- **Pipeline Plugin** - Pipelines declarativos
- **Git Plugin** - Integración Git
- **Credentials Plugin** - Gestión de credenciales

### 3. Herramientas Globales
```
Manage Jenkins > Global Tool Configuration:

NodeJS:
- Name: NodeJS-18
- Version: 18.x
- Global npm packages: vercel@latest

SonarQube Scanner:
- Name: SonarQube
- Install automatically: ✓
```

### 4. Credenciales Necesarias

#### En Jenkins (Manage Jenkins > Credentials):

```
vercel-token:
- Type: Secret text
- Secret: [Tu Vercel Token]
- ID: vercel-token

vercel-org-id:
- Type: Secret text  
- Secret: [Tu Vercel Organization ID]
- ID: vercel-org-id

vercel-project-id:
- Type: Secret text
- Secret: [Tu Vercel Project ID] 
- ID: vercel-project-id

sonarqube-token:
- Type: Secret text
- Secret: [Tu SonarQube Token]
- ID: sonarqube-token
```

### 5. Configuración SonarQube
```
Manage Jenkins > Configure System > SonarQube servers:

Name: SonarQube
Server URL: http://sonarqube:9000
Server authentication token: sonarqube-token
```

## 📦 Configuración Vercel

### 1. Instalar Vercel CLI Localmente
```bash
npm install -g vercel

# Login y obtener tokens
vercel login
vercel teams ls  # Para obtener ORG_ID
```

### 2. Configurar Proyecto en Vercel
```bash
# En el directorio del proyecto
vercel

# Configuración inicial:
# - Framework: Other
# - Build Command: npm run build  
# - Output Directory: dist
# - Install Command: npm ci
```

### 3. Obtener IDs Necesarios
```bash
# Organization ID
vercel teams ls

# Project ID  
vercel project ls

# Token de API
# Vercel Dashboard > Settings > Tokens > Create
```

## 🔄 Flujo de Trabajo

### Ramas y Despliegues

| Rama | Acción | Destino | Quality Gate |
|------|--------|---------|--------------|
| **main** | Push | Vercel Production | ✅ Obligatorio |
| **develop** | Push | Vercel Preview | ✅ Obligatorio |
| **feature/** | Push | Vercel Preview | ❌ Opcional |

### Pipeline Stages

1. **📥 Checkout** - Clonar código
2. **📦 Install** - Dependencias Node.js
3. **🔍 Lint** - ESLint analysis
4. **🧪 Test** - Unit tests + coverage  
5. **🏗️ Build** - Production build
6. **📊 SonarQube** - Code quality analysis
7. **🚪 Quality Gate** - Validación obligatoria
8. **🔧 Vercel CLI** - Instalación herramientas
9. **🚀 Deploy** - Vercel deployment

## 📊 SonarQube Quality Gates

### Métricas Requeridas
- **Coverage:** > 80%
- **Duplicated Lines:** < 3%
- **Maintainability Rating:** A
- **Reliability Rating:** A
- **Security Rating:** A
- **Technical Debt:** < 30min

### Configuración Quality Gate
```
SonarQube > Quality Gates > Create:

Nombre: Pokedex-PWA-Gate
Condiciones:
- Coverage on New Code > 80%
- Duplicated Lines (%) < 3%
- Maintainability Rating = A
- Reliability Rating = A  
- Security Rating = A
```

## 🌐 URLs de Resultado

### Entornos Desplegados
```bash
# Producción (rama main)
https://pokedex-pwa-[hash].vercel.app

# Preview (develop/feature branches)  
https://pokedex-pwa-[hash]-[branch].vercel.app

# Local Development
http://localhost:5173

# Local Docker
http://localhost:3000
```

## 🛠️ Comandos de Gestión

### Jenkins Pipeline
```bash
# Trigger manual build
curl -X POST http://localhost:8090/job/pokedex-pwa-pipeline/build

# Ver logs de último build
curl http://localhost:8090/job/pokedex-pwa-pipeline/lastBuild/console

# Status del pipeline
curl http://localhost:8090/job/pokedex-pwa-pipeline/lastBuild/api/json
```

### Vercel Management
```bash
# List deployments
vercel ls

# Ver logs de deployment
vercel logs [deployment-url]

# Rollback a deployment anterior
vercel rollback [deployment-url]

# Remove deployment
vercel rm [deployment-url]
```

## 🔍 Troubleshooting

### Problemas Comunes

#### Jenkins No Encuentra NodeJS
```bash
# En Jenkins container
docker exec -it jenkins bash
npm install -g n
n 18
```

#### SonarQube Quality Gate Falla
```bash
# Verificar cobertura local
npm run test:run -- --coverage
open coverage/lcov-report/index.html
```

#### Vercel Deploy Falla
```bash
# Debug localmente
vercel --debug
vercel logs

# Verificar build local
npm run build
ls -la dist/
```

---

## ✅ Checklist de Configuración

- [ ] Jenkins corriendo en puerto 8090
- [ ] SonarQube corriendo en puerto 9000  
- [ ] Plugins Jenkins instalados
- [ ] Credenciales configuradas en Jenkins
- [ ] Proyecto creado en Vercel
- [ ] Pipeline job creado en Jenkins
- [ ] Quality Gate configurado en SonarQube
- [ ] Webhooks configurados (opcional)
- [ ] Tests de pipeline ejecutados

**🎯 Resultado:** Pipeline DevOps completo con despliegue automático a Vercel controlado por Jenkins