pipeline {

    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Backend Dependencies') {
            steps {
                dir('backend') {
                    sh '''
                        python3 --version
                        pip3 --version
                        pip3 install -r requirements.txt
                    '''
                }
            }
        }

    }
}
