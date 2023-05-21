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
        stage ('Deploy Server') {
            steps {
                script {
                    SERVER = 'pinglink-ui.keyssoft.xyz'
                    VOLUME = '/app/pinglink-ui'
                }
                withCredentials([usernamePassword(credentialsId: 'pinglink-deployer', passwordVariable: 'PASSWORD', usernameVariable: 'USERNAME')]) {
                    sh "sshpass -p '${PASSWORD}' ssh -o StrictHostKeyChecking=no ${USERNAME}@${SERVER} docker stop pinglink-server || true && docker rm pinglink-server || true"
                    sh "sshpass -p '${PASSWORD}' ssh -o StrictHostKeyChecking=no ${USERNAME}@${SERVER} docker pull keysoutsourcedocker/pinglink-server:latest"
                    sh "sshpass -p '${PASSWORD}' ssh -o StrictHostKeyChecking=no ${USERNAME}@${SERVER} docker run --name pinglink-server -dp 3000:3000 -v /app/pinglink-ui:/app/public keysoutsourcedocker/pinglink-server:latest"
                }
            }
        }
    }
}