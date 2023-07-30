ARG NODE_IMAGE=node:16.20.1-alpine

FROM $NODE_IMAGE AS base
RUN apk --no-cache add dumb-init make
RUN mkdir -p /home/node && chown node:node /home/node
WORKDIR /home/node
USER node
RUN mkdir tmp

FROM base AS dependencies
COPY --chown=node:node ./package*.json ./
RUN yarn
COPY --chown=node:node . .

FROM dependencies AS build
RUN node ace build --production

FROM base AS production
ENV NODE_ENV=production
ENV PORT=$PORT
ENV HOST=0.0.0.0
COPY --chown=node:node ./package*.json ./
RUN yarn --production
COPY --chown=node:node --from=build /home/node/build .
EXPOSE $PORT
CMD [ "dumb-init", "node", "server.js" ]
