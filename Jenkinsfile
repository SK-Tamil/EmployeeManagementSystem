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
        stage('Docker Build') {
    steps {
        dir('backend') {
            sh '''
            docker build -t employee-management-backend:latest .
            '''
        }
    }
}
        stage('Login to ECR') {
    steps {
        sh '''
        aws ecr get-login-password --region ap-southeast-1 | \
        docker login \
        --username AWS \
        --password-stdin 808872801655.dkr.ecr.ap-southeast-1.amazonaws.com
        '''
    }
}
        stage('Tag Docker Image') {
    steps {
        sh '''
        docker tag employee-management-backend:latest \
        808872801655.dkr.ecr.ap-southeast-1.amazonaws.com/employee-management-backend:latest
        '''
    }
}
        stage('Push to ECR') {
    steps {
        sh '''
        docker push \
        808872801655.dkr.ecr.ap-southeast-1.amazonaws.com/employee-management-backend:latest
        '''
    }
}
    stage('Deploy to Development') {
    steps {
        sh '''
        docker pull ${ECR_REPOSITORY}:latest

        docker stop employee-backend || true
        docker rm employee-backend || true

        docker run -d \
            --name employee-backend \
            -p 5000:5000 \
            --env-file backend/.env \
            ${ECR_REPOSITORY}:latest
        '''
    }
}    
    }
}
