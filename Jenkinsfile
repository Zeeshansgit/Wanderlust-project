pipeline {
    agent any

    environment {
        GITHUB_REPO = "https://github.com/Zeeshansgit/Wanderlust-project.git"
        GITHUB_BRANCH = "main"
        GITHUB_CREDENTIALS = "github-creds"

        DOCKER_CREDENTIALS = "dockerhub-creds"
        DOCKER_USERNAME = "zeeshanshaikh799"

        BACKEND_IMAGE = "wanderlust-backend-beta"
        FRONTEND_IMAGE = "wanderlust-frontend-beta"

        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Workspace Cleanup') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout Source Code') {
            steps {
                git branch: "${GITHUB_BRANCH}",
                    credentialsId: "${GITHUB_CREDENTIALS}",
                    url: "${GITHUB_REPO}"
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: "${DOCKER_CREDENTIALS}",
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    sh '''
                    echo $DOCKER_PASS | docker login \
                    -u $DOCKER_USER \
                    --password-stdin
                    '''
                }
            }
        }

        stage('Build Backend Image') {
            steps {
                dir('backend') {
                    sh """
                    docker build \
                    -t ${DOCKER_USERNAME}/${BACKEND_IMAGE}:${IMAGE_TAG} .
                    """
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                dir('frontend') {
                    sh """
                    docker build \
                    -t ${DOCKER_USERNAME}/${FRONTEND_IMAGE}:${IMAGE_TAG} .
                    """
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                sh """
                docker push ${DOCKER_USERNAME}/${BACKEND_IMAGE}:${IMAGE_TAG}
                docker push ${DOCKER_USERNAME}/${FRONTEND_IMAGE}:${IMAGE_TAG}
                """
            }
        }

        stage('Update Kubernetes Manifests') {
            steps {
                dir('kubernetes') {
                    sh """
                    sed -i "s|${DOCKER_USERNAME}/${BACKEND_IMAGE}:.*|${DOCKER_USERNAME}/${BACKEND_IMAGE}:${IMAGE_TAG}|g" backend.yaml

                    sed -i "s|${DOCKER_USERNAME}/${FRONTEND_IMAGE}:.*|${DOCKER_USERNAME}/${FRONTEND_IMAGE}:${IMAGE_TAG}|g" frontend.yaml

                    cat backend.yaml
                    cat frontend.yaml
                    """
                }
            }
        }

        stage('Commit & Push Changes') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: "${GITHUB_CREDENTIALS}",
                        usernameVariable: 'GIT_USER',
                        passwordVariable: 'GIT_TOKEN'
                    )
                ]) {

                    sh """
                    git config user.email "jenkins@wanderlust.com"
                    git config user.name "Jenkins"

                    git add kubernetes/

                    git commit -m "Update image tags to ${IMAGE_TAG}" || true

                    git push https://${GIT_USER}:${GIT_TOKEN}@github.com/Zeeshansgit/Wanderlust-project.git main
                    """
                }
            }
        }
    }

    post {

        success {
            echo """
=========================================
      WANDERLUST CI/CD SUCCESS
=========================================

Build Number : ${BUILD_NUMBER}

Backend Image:
${DOCKER_USERNAME}/${BACKEND_IMAGE}:${IMAGE_TAG}

Frontend Image:
${DOCKER_USERNAME}/${FRONTEND_IMAGE}:${IMAGE_TAG}

GitHub Updated Successfully

ArgoCD will automatically sync

=========================================
"""
        }

        failure {
            echo """
=========================================
      WANDERLUST CI/CD FAILED
=========================================

Check Jenkins Console Output

=========================================
"""
        }

        always {
            cleanWs()
        }
    }
}