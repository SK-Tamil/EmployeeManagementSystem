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
