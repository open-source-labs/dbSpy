FROM node:16.17.0
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm ci && npm cache clean --force && npm run build
RUN sudo amazon-linux-extras enable postgresql13 && sudo yum install postgresql postgresql-server
EXPOSE 3000
ENTRYPOINT npm run start