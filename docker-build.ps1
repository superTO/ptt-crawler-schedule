# 1. 建置映像檔
docker build -t $IMAGE_NAME .

# 2. 標記 (Tag) 映像檔，使其符合 Artifact Registry 的路徑
docker tag $IMAGE_NAME ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${IMAGE_NAME}:latest

# 3. 推送映像檔
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${IMAGE_NAME}:latest