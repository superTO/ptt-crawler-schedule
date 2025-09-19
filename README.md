# ptt-crawler-schedule

# How to use
1. Fork repository
2. Settings > Environments > click "New environment" > type "main" > click "Configure environment"
3. Environment secrets > click "Add environment secret" > type Name "LINE_NOTIFY_TOKEN" > type value "there is your line token"
4. update "ptt-crawler-schedule/data.js"

# [blog](https://superto.github.io/2024/05/21/ptt-crawler-line-notify/)



## 2025-5-22 更新

github action IP 會被 https://www.ptt.cc/bbs/ 擋掉, 所以會掃不到內容導致 timeout.

## 2025-9-19 更新

branch: google-run-cloud

成功將程式碼部屬到 GCP