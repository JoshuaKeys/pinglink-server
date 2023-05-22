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
       
                withCredentials([usernamePassword(credentialsId: 'pinglink-deployer', passwordVariable: 'PASSWORD', usernameVariable: 'USERNAME')]) {
                        sh "sshpass -p '${PASSWORD}' ssh -o StrictHostKeyChecking=no ${USERNAME}@pinglink-ui.keyssoft.xyz rm -rf ping-ui"
                        sh "sshpass -p '${PASSWORD}' ssh -o StrictHostKeyChecking=no ${USERNAME}@pinglink-ui.keyssoft.xyz git clone https://github.com/JoshuaKeys/ping-ui.git"
                        sh "sshpass -p '${PASSWORD}' ssh -o StrictHostKeyChecking=no ${USERNAME}@pinglink-ui.keyssoft.xyz ls -ltr"
                        // sh "sshpass -p '${PASSWORD}' ssh -o StrictHostKeyChecking=no ${USERNAME}@pinglink-ui.keyssoft.xyz pm2 stop ping-ui/index.js || true"
                        // sh "sshpass -p '${PASSWORD}' ssh -o StrictHostKeyChecking=no ${USERNAME}@pinglink-ui.keyssoft.xyz pm2 start ping-ui/index.js"
                    }

            }
        }

    }
}