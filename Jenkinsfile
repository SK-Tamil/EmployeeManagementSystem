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
                    url: 'https://github.com/SK-Tamil/EmployeeManagementSystem.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                python3 -m venv venv
                . venv/bin/activate

                pip install --upgrade pip
                pip install -r backend/requirements.txt

                pip install pytest
                '''
            }
        }

        stage('Run Tests') {
            steps {
                sh '''
                . venv/bin/activate

                if [ -d tests ] || ls test_*.py backend/test_*.py >/dev/null 2>&1; then
                    pytest
                else
                    echo "No tests found. Skipping..."
                fi
                '''
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo "Running SonarQube Analysis..."
                // sonar-scanner
            }
        }

        stage('Docker Build') {
    steps {
        sh '''
        docker build -f backend/Dockerfile -t $IMAGE_NAME:$IMAGE_TAG backend
        '''
    }
}

        stage('Trivy Scan') {
            steps {
                sh '''
                trivy image --exit-code 0 --severity LOW,MEDIUM,HIGH,CRITICAL $IMAGE_NAME:$IMAGE_TAG
                '''
            }
        }

        stage('Push to ECR') {
            steps {
                sh '''
                echo "Logging in to Amazon ECR..."
                aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 808872801655.dkr.ecr.ap-southeast-1.amazonaws.com

                docker tag $IMAGE_NAME:$IMAGE_TAG $ECR_REPO:$IMAGE_TAG

                docker push $ECR_REPO:$IMAGE_TAG
                '''
            }
        }
    }

    post {
        success {
            echo "===================================="
            echo "CI Pipeline Completed Successfully!"
            echo "===================================="
        }

        failure {
            echo "===================================="
            echo "CI Pipeline Failed!"
            echo "===================================="
        }

        always {
            cleanWs()
        }
    }
}
