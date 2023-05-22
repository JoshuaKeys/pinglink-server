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
                sshagent(credentials: ['pinglink.keyssoft.xyz']) {
                    sh '''
                        [ -d ~/.ssh ] || mkdir ~/.ssh && chmod 0700 ~/.ssh
                        ssh-keyscan -t rsa,dsa pinglink.keyssoft.xyz >> ~/.ssh/known_hosts
                        echo "Hello World"
                        cat ~/.ssh/known_hosts
                        sshpass ssh -o StrictHostKeyChecking=no root@pinglink.keyssoft.xyz ls -ltr
                    '''
                }
                withCredentials([usernamePassword(credentialsId: 'pinglink-deployer', passwordVariable: 'PASSWORD', usernameVariable: 'USERNAME')]) {
                    sh "sshpass -p '${PASSWORD}' ssh -o StrictHostKeyChecking=no ${USERNAME}@${SERVER} docker stop pinglink-server || true"
                    sh "sshpass -p '${PASSWORD}' ssh -o StrictHostKeyChecking=no ${USERNAME}@${SERVER} docker rm pinglink-server || true"
                    sh "sshpass -p '${PASSWORD}' ssh -o StrictHostKeyChecking=no ${USERNAME}@${SERVER} docker pull keysoutsourcedocker/pinglink-server:latest"
                    sh "sshpass -p '${PASSWORD}' ssh -o StrictHostKeyChecking=no ${USERNAME}@${SERVER} docker run --name pinglink-server -dp 3000:3000 keysoutsourcedocker/pinglink-server:latest"
                }
            }
        }
    }
}