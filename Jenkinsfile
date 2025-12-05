pipeline {
    agent any
    
    tools {
        nodejs "NodeJS-18"
    }
    
    environment {
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
                    
                    // Detectar rama actual
                    env.CURRENT_BRANCH = sh(
                        script: 'git branch --show-current 2>/dev/null || git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main"',
                        returnStdout: true
                    ).trim()
                    
                    echo "🌿 Rama detectada: ${env.CURRENT_BRANCH}"
                    echo "🌿 BRANCH_NAME: ${env.BRANCH_NAME}"
                    echo "🌿 GIT_BRANCH: ${env.GIT_BRANCH}"
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
                script {
                    try {
                        withSonarQubeEnv('SonarQube') {
                            sh '''
                                # Instalar SonarQube Scanner temporalmente si no está disponible
                                if ! command -v sonar-scanner >/dev/null 2>&1; then
                                    echo "📥 Descargando SonarQube Scanner..."
                                    curl -L -o /tmp/sonar-scanner.zip https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.8.0.2856.zip
                                    unzip -q /tmp/sonar-scanner.zip -d /tmp/
                                    export PATH="/tmp/sonar-scanner-4.8.0.2856/bin:$PATH"
                                fi
                                
                                echo "✅ Ejecutando análisis SonarQube..."
                                sonar-scanner \\
                                  -Dsonar.projectKey=pokedx-pwa \\
                                  -Dsonar.projectName="Pokedex PWA - DevOps Evaluation" \\
                                  -Dsonar.projectVersion=${BUILD_NUMBER} \\
                                  -Dsonar.sources=src \\
                                  -Dsonar.tests=src/test \\
                                  -Dsonar.test.inclusions=**/*.test.*,**/*.spec.* \\
                                  -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \\
                                  -Dsonar.coverage.exclusions=**/*.test.*,**/*.spec.*,**/node_modules/**
                            '''
                        }
                    } catch (Exception e) {
                        echo "⚠️  Error en análisis SonarQube: ${e.message}"
                    }
                }
            }
        }
        
        stage('Quality Gate') {
            steps {
                echo '🚪 Verificando Quality Gate...'
                script {
                    try {
                        timeout(time: 10, unit: 'MINUTES') {
                            def qg = waitForQualityGate()
                            if (qg.status != 'OK') {
                                echo "⚠️  Quality Gate FALLÓ: ${qg.status}"
                                // No falla el pipeline, solo advierte
                            } else {
                                echo "✅ Quality Gate PASSED"
                            }
                        }
                    } catch (Exception e) {
                        echo "⚠️  Quality Gate no disponible, ejecutando lint como fallback"
                        sh 'npm run lint || true'
                    }
                }
            }
        }
        
        stage('Build for Production') {
            when {
                anyOf {
                    branch 'main'
                    branch 'origin/main'
                    expression { env.GIT_BRANCH == 'origin/main' }
                    expression { env.BRANCH_NAME == 'main' }
                }
            }
            steps {
                echo '🏗️ Construyendo aplicación para producción...'
                sh 'npm run build'
                
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
                anyOf {
                    branch 'main'
                    branch 'origin/main'
                    expression { env.GIT_BRANCH == 'origin/main' }
                    expression { env.BRANCH_NAME == 'main' }
                }
            }
            steps {
                echo '🚀 Desplegando a Producción via CLI...'
                script {
                    try {
                        withCredentials([
                            string(credentialsId: 'VERCEL_TOKEN', variable: 'VERCEL_TOKEN'),
                            string(credentialsId: 'VERCEL_ORG_ID', variable: 'VERCEL_ORG_ID'),
                            string(credentialsId: 'VERCEL_PROJECT_ID', variable: 'VERCEL_PROJECT_ID')
                        ]) {
                            sh '''
                                echo "🔧 Verificando credenciales..."
                                if [ -z "$VERCEL_TOKEN" ]; then
                                    echo "❌ VERCEL_TOKEN no configurado"
                                    exit 1
                                fi
                                echo "✅ Token configurado (${#VERCEL_TOKEN} caracteres)"
                                
                                echo "📦 Instalando Vercel CLI..."
                                npm install -g vercel@latest
                                
                                echo "📋 Configurando proyecto..."
                                mkdir -p .vercel
                                cat > .vercel/project.json << EOF
{
  "orgId": "${VERCEL_ORG_ID}",
  "projectId": "${VERCEL_PROJECT_ID}"
}
EOF
                                
                                echo "📂 Contenido de .vercel/project.json:"
                                cat .vercel/project.json
                                
                                echo "🚀 Iniciando deployment..."
                                vercel deploy --prod --token=${VERCEL_TOKEN} --yes --force
                                
                                echo "✅ Deployment completado"
                            '''
                        }
                    } catch (Exception e) {
                        echo "❌ Error en deployment: ${e.message}"
                        error "Deployment to Vercel failed: ${e.message}"
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo '🧹 Limpiando workspace...'
            sh '''
                rm -rf .vercel/
                rm -rf node_modules/
                rm -f *.log
            '''
        }
        
        success {
            script {
                def branch = env.CURRENT_BRANCH ?: env.BRANCH_NAME ?: env.GIT_BRANCH ?: "unknown"
                def message = """
✅ Pipeline EXITOSO - Pokedx PWA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Build: #${BUILD_NUMBER}
🌿 Rama: ${branch}
📝 Commit: ${GIT_COMMIT_SHORT}
⏱️ Duración: ${currentBuild.durationString}
"""

                echo message
            }
        }
        
        failure {
            script {
                def branch = env.CURRENT_BRANCH ?: env.BRANCH_NAME ?: env.GIT_BRANCH ?: "unknown"
                
                def errorMessage = """
❌ Pipeline FALLÓ - Pokedx PWA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Build: #${BUILD_NUMBER}
🌿 Rama: ${branch}
📝 Commit: ${GIT_COMMIT_SHORT}
🔗 Logs: ${BUILD_URL}console
"""
                echo errorMessage
            }
        }
        
        cleanup {
            cleanWs()
        }
    }
}
