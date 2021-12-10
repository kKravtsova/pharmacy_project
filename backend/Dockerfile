FROM node:16.13.0-alpine
RUN mkdir -p /app/config /app/src
WORKDIR /app
COPY .babelrc /app/.babelrc
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm install
EXPOSE 5000
CMD ["npm", "run", "start"]