FROM node:dubnium-alpine
WORKDIR /app

COPY package.json ./package.json
COPY yarn.lock ./yarn.lock

RUN yarn install

COPY src /app/src

CMD ["yarn", "start"]
