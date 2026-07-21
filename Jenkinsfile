pipeline {
    agent any

    stages {
        

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Git Version') {
            steps {
                sh 'git --version'
            }
        }

        stage('Docker Version') {
            steps {
                sh 'docker --version'
            }
        }

    }
}
