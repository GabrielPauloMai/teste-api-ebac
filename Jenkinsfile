pipeline {
    agent any
    
    stages {
        stage('Clonar o repositório') {
            steps {
                git 'https://github.com/GabrielPauloMai/teste-api-ebac.git'
            }
        }
        
        stage('Instalar dependências') {
            steps {
                ansiColor('css') {
                    sh 'npm install'
                }
            }
        }
        
        stage('Iniciar Serverest') {
            steps {
                ansiColor('css') {
                    sh 'npx serverest &'
                    sleep(time: 5, unit: 'SECONDS')
                }
            }
        }

        stage('Criar usuário admin') {
            steps {
                ansiColor('css') {
                    sh '''
                    curl -X POST http://localhost:3000/usuarios \
                    -H "Content-Type: application/json" \
                    -d \'{"nome": "Fulano", "email":"fulano@qa.com","password":"teste", "administrador": "true"}\'
                    '''
                }
            }
        }
        
        stage('Executar testes com Cypress') {
            steps {
                ansiColor('css') {
                    sh 'npm test'
                }
            }
        }
    }
}
