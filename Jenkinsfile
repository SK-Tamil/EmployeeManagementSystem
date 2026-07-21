pipeline {

    agent any

    options {
        skipDefaultCheckout(true)
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                dir('backend') {
                    sh 'docker build -t employee-backend:v1 .'
                }
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                dir('frontend') {
                    sh 'docker build -t employee-frontend:v1 .'
                }
            }
        }

        stage('Smoke Test') {
    steps {
        sh '''
            docker rm -f backend frontend || true

            docker run -d \
              --name backend \
              -p 5000:5000 \
              employee-backend:v1

            docker run -d \
              --name frontend \
              -p 8081:80 \
              employee-frontend:v1

            sleep 15

            curl -f http://localhost:5000/

            curl -f http://localhost:8081/
        '''
    }
}
    }

    post {

        success {
            echo 'Docker Images Built Successfully!'
        }

        failure {
            echo 'Pipeline Failed!'
        }

    }
}
