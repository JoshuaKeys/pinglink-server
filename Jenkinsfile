pipeline {
    agent any


    triggers {
        pollSCM('*/1 * * * *')
    }

    stages {
        stage('setup') {
            steps {
                nodejs(nodeJSInstallationName: 'nodejs') {
                    sh 'npm install'
                }
            }
        }
        stage('Build') {
            steps {
                sh 'docker build -t keysoutsourcedocker/pinglink-server .'
            }
        }
        stage ('Push to DockerHub') {
            steps {
                sh 'docker push keysoutsourcedocker/pinglink-server'
            }
        }
    }
}