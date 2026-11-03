FROM node:26-alpine AS build

RUN apk add --no-cache python3 make

WORKDIR /app

COPY package*.json ./

RUN npm ci

ENV PORT=3000

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]