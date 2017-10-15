FROM node:8.2.1-alpine

# To get the latest version this requires having run `npm install`, `npm run build` prior to building the container

WORKDIR /usr/src/wowanalyzer/discordbot/
COPY build /usr/src/wowanalyzer/discordbot/build/
COPY node_modules /usr/src/wowanalyzer/discordbot/node_modules/
COPY package.json /usr/src/wowanalyzer/discordbot/

USER node
CMD ["npm", "run", "prod"]
