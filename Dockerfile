FROM node:22.19.0

WORKDIR /usr/src/app

# 安裝 Chromium 和必要的相依套件
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
    --no-install-recommends

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "node", "index.js" ]