FROM node:16.17.0
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm i postgresql-client -g
RUN npm ci && npm cache clean --force && npm run build
EXPOSE 3000
ENTRYPOINT npm run start