pipeline {

    agent any


    environment {

        IMAGE_NAME = "employee-management"

        IMAGE_TAG = "${BUILD_NUMBER}"

        ECR_REPO = "808872801655.dkr.ecr.ap-southeast-1.amazonaws.com/employee-management"

    }


    stages {


        stage('Checkout') {
            steps {
                git branch: 'main',
                credentialsId: 'github-token',
                url: ''
            }
        }


        stage('Install Dependencies') {
            steps {
                sh '''
                pip install -r backend/requirements.txt
                '''
            }
        }


        stage('Run Tests') {
            steps {
                sh '''
                pytest
                '''
            }
        }


        stage('SonarQube Analysis') {
            steps {
                echo "Running SonarQube Scan"
            }
        }


        stage('Docker Build') {
            steps {
                sh '''
                docker build -t $IMAGE_NAME:$IMAGE_TAG .
                '''
            }
        }


        stage('Trivy Scan') {
            steps {
                sh '''
                trivy image $IMAGE_NAME:$IMAGE_TAG
                '''
            }
        }


        stage('Push to ECR') {
            steps {
                echo "Push image to ECR"
            }
        }

    }


    post {

        success {
            echo "CI Pipeline Successful"
        }


        failure {
            echo "CI Pipeline Failed"
        }

    }

}
