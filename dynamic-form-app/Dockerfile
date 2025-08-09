FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY . .

RUN npm run build -- --no-lint

CMD ["sh", "-c", "sleep 10 && npm run seed"]