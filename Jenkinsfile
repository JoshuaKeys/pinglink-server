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
                        sshpass scp -o StrictHostKeyChecking=no -r root@pinglink.keyssoft.xyz:/app/pinglink-ui pinglink-ui/ || false
                    '''
                }
                withCredentials([usernamePassword(credentialsId: 'pinglink-deployer', passwordVariable: 'PASSWORD', usernameVariable: 'USERNAME')]) {
                    sh "sshpass -p '${PASSWORD}' ssh -o StrictHostKeyChecking=no ${USERNAME}@${SERVER} docker stop pinglink-server || true"
                    sh "sshpass -p '${PASSWORD}' ssh -o StrictHostKeyChecking=no ${USERNAME}@${SERVER} docker rm pinglink-server || true"
                    sh "sshpass -p '${PASSWORD}' ssh -o StrictHostKeyChecking=no ${USERNAME}@${SERVER} docker pull keysoutsourcedocker/pinglink-server:latest"
                    sh "sshpass -p '${PASSWORD}' ssh -o StrictHostKeyChecking=no ${USERNAME}@${SERVER} docker run --name pinglink-server -dp 3000:3000 keysoutsourcedocker/pinglink-server:latest"
                    sh "sshpass -p '${PASSWORD}' ssh -o StrictHostKeyChecking=no ${USERNAME}@${SERVER} docker cp ./pinglink-ui pinglink-server:/app/public"

                }
            }
        }
        stage('Build') {
            steps {
                nodejs(nodeJSInstallationName: 'nodejs') {
                withCredentials([usernamePassword(credentialsId: 'pinglink-deployer', passwordVariable: 'PASSWORD', usernameVariable: 'USERNAME')]) {
                        sh "sshpass -p '${PASSWORD}' ssh -o StrictHostKeyChecking=no ${USERNAME}@pinglink-ui.keyssoft.xyz rm -rf ping-ui"
                        sh "sshpass -p '${PASSWORD}' ssh -o StrictHostKeyChecking=no ${USERNAME}@pinglink-ui.keyssoft.xyz git clone https://github.com/JoshuaKeys/ping-ui.git"
                        sh "sshpass -p '${PASSWORD}' ssh -o StrictHostKeyChecking=no ${USERNAME}@pinglink-ui.keyssoft.xyz npm install pm2 -g"
                        sh "sshpass -p '${PASSWORD}' ssh -o StrictHostKeyChecking=no ${USERNAME}@pinglink-ui.keyssoft.xyz pm2 stop ping-ui/index.js || true"
                        sh "sshpass -p '${PASSWORD}' ssh -o StrictHostKeyChecking=no ${USERNAME}@pinglink-ui.keyssoft.xyz pm2 start ping-ui/index.js"
                }

                }   
            }
        }
        // stage ('Push to DockerHub') {
        //     steps {
        //         sh 'docker push keysoutsourcedocker/pinglink-server'
        //     }
        // }

    }
}