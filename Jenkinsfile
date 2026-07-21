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
            # Remove old containers if they exist
            docker rm -f backend-test || true
            docker rm -f frontend-test || true

            # Run backend
            docker run -d \
              --name backend-test \
              -p 5000:5000 \
              employee-backend:v1

            # Run frontend
            docker run -d \
              --name frontend-test \
              -p 8081:80 \
              employee-frontend:v1

            # Wait for containers
            sleep 15

            # Check running containers
            docker ps

            # Backend Health Check
            curl -f http://localhost:5000/

            # Frontend Health Check
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
