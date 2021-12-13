FROM node:16.13.0-alpine
RUN mkdir -p /app/config /app/src
WORKDIR /app
COPY . .
RUN npm run build:front
RUN npm install
EXPOSE 5000
CMD ["npm", "run", "start"]