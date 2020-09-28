FROM node:lts-alpine as build

COPY ./package.json /build/
COPY ./package-lock.json /build/
WORKDIR /build
RUN npm ci

FROM node:lts-alpine as deploy
USER node
COPY --from=build --chown=node:node /build/node_modules /app/node_modules
COPY --chown=node:node . /app
WORKDIR /app

CMD [ "npm", "start" ]