FROM node:22-alpine

WORKDIR /app
COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY . .

RUN npm run build
RUN npx prisma generate

EXPOSE ${APP_DOCKER_PORT:-3000}

ENV NODE_ENV=production

CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"development\" ]; then npm run start:dev; else npm run start:prod; fi"]
