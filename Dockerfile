FROM library/postgres
COPY ./init.sql /docker-entrypoint-initdb.d/

# Build AdonisJS
FROM node:lts-alpine as builder
# Set directory for all files
WORKDIR /home/node
# Copy over package.json files
COPY package*.json ./
# Absence of Python library.
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*
# Install all packages
RUN yarn
# Copy over source code
COPY . .
# Build AdonisJS for production
RUN yarn build


# Build final runtime container
FROM node:lts-alpine
# Set environment variables
ENV NODE_ENV=development
# Disable .env file loading
# ENV ENV_SILENT=true
# Set home dir
WORKDIR /home/node
# Copy over built files
COPY --from=builder /home/node/build .
# Install python3
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*
# Install only required packages
RUN rm -rf node_modules && yarn install --frozen-lockfile --production
# Install separately pino-pretty
RUN yarn add pino-pretty
# Expose port to outside world
EXPOSE 3333
# Start server up
CMD [ "yarn", "docker" ]
