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

        stage('Backend Dependencies') {
            steps {
                dir('backend') {
                    sh '''
                        python3 -m pip install --upgrade pip
                        pip3 install -r requirements.txt
                    '''
                }
            }
        }

    }
}
