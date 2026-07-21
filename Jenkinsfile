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
                    sh '''
                        docker build -t employee-backend:v1 .
                    '''
                }
            }
        }

    }

    post {

        success {
            echo 'Backend Docker Image Built Successfully!'
        }

        failure {
            echo 'Backend Docker Build Failed!'
        }

    }

}
