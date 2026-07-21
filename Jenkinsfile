pipeline {
    agent any

    environment {
        DB_USER = credentials('DB_USER')
        DB_PASSWORD = credentials('DB_PASSWORD')
        DB_HOST = credentials('DB_HOST')
        DB_NAME = credentials('DB_NAME')
        S3_BUCKET = credentials('S3_BUCKET')
        S3_REGION = credentials('S3_REGION')
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Test') {
            steps {
                dir('backend') {
                    sh '''
                    python3 -m venv venv
                    . venv/bin/activate

                    pip install -r requirements.txt

                    coverage run -m pytest
                    coverage xml
                    '''
                }
            }
        }

        stage('SonarQube Analysis') {
            environment {
                scannerHome = tool 'SonarScanner'
            }
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                    ${scannerHome}/bin/sonar-scanner
                    '''
                }
            }
        }

        stage('Build') {
            steps {
                echo "Backend Tests and SonarQube Analysis Passed"
            }
        }
    }
}
