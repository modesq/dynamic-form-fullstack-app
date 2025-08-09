FROM node:18

WORKDIR /app

COPY package*.json ./

RUN rm -rf node_modules package-lock.json
RUN npm install

COPY . .

RUN npm run build -- --no-lint

CMD ["sh", "-c", "sleep 10 && npm run seed"]