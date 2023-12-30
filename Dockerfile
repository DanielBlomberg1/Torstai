FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn global add ts-node
RUN yarn

COPY . .

CMD [ "ts-node", "src/Bot.ts" ]