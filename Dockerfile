# --- 階段 1 ---
FROM node:22.19.0-slim AS builder

WORKDIR /usr/src/app

COPY package*.json ./

# 告訴 Puppeteer/NPM：不要下載你自帶的瀏覽器！
ENV PUPPETEER_SKIP_DOWNLOAD=true

# 現在 npm ci 只會安裝 "puppeteer" 這個套件庫，不會下載瀏覽器
RUN npm ci --omit=dev

COPY . .

# --- 階段 2 ---
FROM node:22.19.0-slim
WORKDIR /usr/src/app

# 我們必須裝回系統的 chromium，因為 ptt-crawler 指定要用它
RUN apt-get update && apt-get install -y \
    chromium \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libgbm1 \
    libasound2 \
    libpango-1.0-0 \
    libxshmfence1 \
    libxfixes3 \
    libxcomposite1 \
    libxrandr2 \
    libxss1 \
    libxtst6 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# 從 "builder" 階段複製 "沒有" 瀏覽器的 node_modules
COPY --from=builder /usr/src/app/node_modules ./node_modules

# 從 "builder" 階段複製程式碼
COPY --from=builder /usr/src/app/ ./

EXPOSE 8080

# ENTRYPOINT 是固定的執行程式
ENTRYPOINT [ "node" ]
# CMD 是預設傳給 ENTRYPOINT 的參數
CMD [ "index.js" ]

## 測試指令: docker run your-image-name onlyText.js