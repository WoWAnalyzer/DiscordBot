FROM node:8.2.1-alpine

WORKDIR /usr/src/wowanalyzer/discordbot/

# By doing this separate we allow Docker to cache this
COPY package.json package-lock.json /usr/src/wowanalyzer/discordbot/
RUN npm install

COPY . /usr/src/wowanalyzer/discordbot/

USER node
CMD ["npm", "start"]
