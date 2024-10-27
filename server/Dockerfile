FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx tsc

EXPOSE 4000

CMD ["node", "dist/index.js"]
