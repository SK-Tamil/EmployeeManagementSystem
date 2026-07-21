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
                        which python3
                        python3 --version

                        which pip3
                        pip3 --version

                        pip3 install -r requirements.txt
                    '''
                }
            }
        }
    }
}
