FROM node:20-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

RUN mkdir -p /app/tmp /app/uploads

EXPOSE 5001

CMD ["npm", "run", "start"]
