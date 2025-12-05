pipeline {
    agent any
    
    tools {
        nodejs "NodeJS-18"
        SonarScanner "sonar-scanner"
    }
    
    environment {
        // Variables del proyecto
        PROJECT_NAME = 'pokedex-pwa'
        SONAR_PROJECT_KEY = 'pokedx-pwa'
        SONAR_HOST_URL = 'http://localhost:9000'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '📥 Clonando repositorio...'
                checkout scm
                
                script {
                    env.GIT_COMMIT_SHORT = sh(
                        script: 'git rev-parse --short HEAD',
                        returnStdout: true
                    ).trim()
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo '📦 Instalando dependencias...'
                sh '''
                    node --version
                    npm --version
                    npm ci
                '''
            }
        }
        
        stage('Unit Tests') {
            steps {
                echo '🧪 Ejecutando Tests Unitarios...'
                sh '''
                    npm run test:run -- --coverage
                '''
            }
            post {
                always {
                    // Archivar reportes de coverage
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'Coverage Report'
                    ])
                }
            }
        }
        
        stage('SonarQube Analysis') {
            steps {
                echo '📊 Ejecutando Análisis de Código Estático...'
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        sonar-scanner \\
                        -Dsonar.projectKey=${SONAR_PROJECT_KEY} \\
                        -Dsonar.projectName="Pokedex PWA - DevOps Evaluation" \\
                        -Dsonar.projectVersion=${BUILD_NUMBER} \\
                        -Dsonar.sources=src \\
                        -Dsonar.tests=src/test \\
                        -Dsonar.test.inclusions="**/*.test.*,**/*.spec.*" \\
                        -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \\
                        -Dsonar.coverage.exclusions="**/*.test.*,**/*.spec.*,**/node_modules/**" \\
                        -Dsonar.host.url=${SONAR_HOST_URL}
                    '''
                }
            }
        }
        
        stage('Quality Gate') {
            steps {
                echo '🚪 Esperando veredicto de SonarQube Quality Gate...'
                timeout(time: 10, unit: 'MINUTES') {
                    script {
                        def qg = waitForQualityGate()
                        if (qg.status != 'OK') {
                            error "❌ Quality Gate FALLÓ: ${qg.status}"
                        } else {
                            echo "✅ Quality Gate PASÓ exitosamente"
                        }
                    }
                }
            }
        }
        
        stage('Build for Production') {
            when {
                branch 'main'
            }
            steps {
                echo '🏗️ Construyendo aplicación para producción...'
                sh 'npm run build'
                
                // Verificar build exitoso
                sh '''
                    if [ ! -d "dist" ] || [ ! -f "dist/index.html" ]; then
                        echo "❌ Error: Build falló"
                        exit 1
                    fi
                    echo "✅ Build exitoso"
                    ls -la dist/
                '''
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                echo '🚀 Desplegando a Producción via CLI...'
                script {
                    // Inyectar credenciales de Vercel de forma segura
                    withCredentials([
                        string(credentialsId: 'VERCEL_TOKEN', variable: 'VERCEL_TOKEN'),
                        string(credentialsId: 'VERCEL_ORG_ID', variable: 'VERCEL_ORG_ID'),
                        string(credentialsId: 'VERCEL_PROJECT_ID', variable: 'VERCEL_PROJECT_ID')
                    ]) {
                        sh '''
                            # Instalar Vercel CLI
                            npm install -g vercel@latest
                            
                            # Crear archivo .vercel/project.json para evitar interactividad
                            mkdir -p .vercel
                            cat > .vercel/project.json << EOF
{
  "orgId": "${VERCEL_ORG_ID}",
  "projectId": "${VERCEL_PROJECT_ID}"
}
EOF
                            
                            # Despliegue headless sin interactividad
                            vercel deploy --prod --token=${VERCEL_TOKEN} --yes --force
                            
                            # Obtener URL de producción
                            PROD_URL=$(vercel ls --prod --token=${VERCEL_TOKEN} | head -1 | awk '{print $2}')
                            echo "🌐 URL de Producción: ${PROD_URL}"
                        '''
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo '🧹 Limpiando workspace...'
            // Limpiar archivos sensibles
            sh '''
                rm -rf .vercel/
                rm -rf node_modules/
                rm -f *.log
            '''
        }
        
        success {
            script {
                def message = """
✅ Pipeline EXITOSO - Pokedx PWA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Build: #${BUILD_NUMBER}
🌿 Rama: ${BRANCH_NAME}  
📝 Commit: ${GIT_COMMIT_SHORT}
⏱️ Duración: ${currentBuild.durationString}
"""
                if (env.BRANCH_NAME == 'main') {
                    message += """
🚀 DESPLEGADO A PRODUCCIÓN
🌐 Verificar en Vercel Dashboard
"""
                } else {
                    message += """
🔄 RAMA DEVELOP - Deploy SALTADO
✨ Quality Gate pasado, listo para merge a main
"""
                }
                echo message
            }
        }
        
        failure {
            script {
                def failureReason = "Etapa no identificada"
                
                // Identificar en qué etapa falló
                if (env.STAGE_NAME == "Quality Gate") {
                    failureReason = "Quality Gate - Código no cumple estándares"
                } else if (env.STAGE_NAME == "Unit Tests") {
                    failureReason = "Tests Unitarios - Tests fallando"
                } else if (env.STAGE_NAME == "SonarQube Analysis") {
                    failureReason = "Análisis SonarQube - Error de configuración"
                } else if (env.STAGE_NAME == "Deploy to Production") {
                    failureReason = "Despliegue - Error en Vercel"
                }
                
                def errorMessage = """
❌ Pipeline FALLÓ - Pokedx PWA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Build: #${BUILD_NUMBER}
🌿 Rama: ${BRANCH_NAME}
📝 Commit: ${GIT_COMMIT_SHORT}
💥 Falló en: ${failureReason}
🔗 Logs: ${BUILD_URL}console

🛠️ ACCIÓN REQUERIDA:
   Revisar logs y corregir errores antes de nuevo push
"""
                echo errorMessage
            }
        }
        
        cleanup {
            cleanWs()
        }
    }
}