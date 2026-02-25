FROM node:20-alpine

WORKDIR /app

COPY vite-project/package*.json ./
RUN npm install

COPY vite-project ./

EXPOSE 3000

CMD ["npm", "run", "dev"]