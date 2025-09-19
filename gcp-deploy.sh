# 設定 token 在GCP上
gcloud secrets create CHANNEL_ACCESS_TOKEN --replication-policy="automatic"
echo "[token]" | gcloud secrets versions add CHANNEL_ACCESS_TOKEN --data-file=-

gcloud secrets create USERID --replication-policy="automatic"
echo "[token]" | gcloud secrets versions add USERID --data-file=-

# 1. 授權存取 CHANNEL_ACCESS_TOKEN
gcloud secrets add-iam-policy-binding CHANNEL_ACCESS_TOKEN --member="serviceAccount:[SERVICE_ACCOUNT_EMAIL]" --role="roles/secretmanager.secretAccessor"

# 2. 授權存取 USERID
gcloud secrets add-iam-policy-binding USERID --member="serviceAccount:[SERVICE_ACCOUNT_EMAIL]" --role="roles/secretmanager.secretAccessor"


## deploy
gcloud run jobs deploy my-scheduled-scraper --image=${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${IMAGE_NAME}:latest --region=${REGION} --set-secrets="CHANNEL_ACCESS_TOKEN=[TOKEN-Resource name]:latest,USERID=[TOKEN-Resource name]:latest"
gcloud run jobs execute my-scheduled-scraper --region=${REGION}


# 設定排程
# 1. 建立服務帳號
gcloud iam service-accounts create scheduler-invoker

# 2. 授予它觸發 Cloud Run Job 的權限
gcloud run jobs add-iam-policy-binding my-scheduled-scraper --region=${REGION} --member="serviceAccount:scheduler-invoker@${PROJECT_ID}.iam.gserviceaccount.com" --role="roles/run.invoker"

# 3. 授予它執行 Job 的權限 (如果需要)
# gcloud iam service-accounts add-iam-policy-binding scheduler-invoker@${PROJECT_ID}.iam.gserviceaccount.com --project=${PROJECT_ID} --role="roles/iam.serviceAccountUser" --member="serviceAccount:scheduler-invoker@${PROJECT_ID}.iam.gserviceaccount.com"

# 4. 建立排程
gcloud scheduler jobs create http ptt-crawler-scheduler --project=${PROJECT_ID} --location=${REGION} --schedule="0 12,20 * * *" --time-zone="Asia/Taipei" --uri="https://run.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}/jobs/my-scheduled-scraper:run" --http-method=POST --description="Daily PTT Crawler" --oidc-service-account-email="scheduler-invoker@${PROJECT_ID}.iam.gserviceaccount.com"
