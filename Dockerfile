FROM node:22-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install --only=production --no-cache

COPY . .

RUN chmod -R 755 /usr/src/app

USER node

ENV NODE_ENV=production

ENTRYPOINT ["node", "./visionboard.js"]