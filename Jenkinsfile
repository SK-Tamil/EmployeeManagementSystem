pipeline {

    agent any

    stages {

        stage('Checkout') {
            steps {
                echo "Checking out source code..."
                checkout scm
            }
        }

        stage('Backend Dependencies') {
            steps {
                dir('backend') {
                    sh '''
                        python3 -m venv venv
                        . venv/bin/activate
                        pip install --upgrade pip
                        pip install -r requirements.txt
                    '''
                }
            }
        }

    }

    post {

        success {
            echo "Pipeline executed successfully!"
        }

        failure {
            echo "Pipeline execution failed!"
        }

    }

}
