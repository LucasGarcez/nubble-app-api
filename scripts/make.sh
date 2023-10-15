#!/bin/bash

CONTAINER="nubble"

# Docker
docker-start() {
    docker compose up -d
}

docker-build() {
    docker compose up -d --build
}

docker-down() {
    docker compose down
}

docker-rebuild-all() {
    docker-stop
    docker-build
}

docker-rebuild-postgres() {
    docker compose build --no-cache postgres
}

docker-web-shell() {
    docker container exec -it "${CONTAINER}-web" bash
}

docker-db-shell() {
    docker container exec -it "${CONTAINER}-postgres" bash
}

# Adonis
watch() {
    node ace serve --watch
}

migration() {
    node ace migration:run
}

migration-docker() {
    docker exec -ti "${CONTAINER}-web" sh -c "node ace migration:run"
}

migration-test() {
    node ace migration:run --dry-run
}

migration-test-docker() {
    docker exec -ti "${CONTAINER}-web" sh -c "node ace migration:run --dry-run"
}

rollback() {
    node ace migration:rollback
}

rollback-docker() {
    docker exec -ti "${CONTAINER}-web" sh -c "node ace migration:rollback"
}

seed() {
    node ace db:seed
}

seed-docker() {
    docker exec -ti "${CONTAINER}-web" sh -c "node ace db:seed"
}

reset() {
    rollback
    migration
    seed
}

reset-docker() {
    docker exec -ti "${CONTAINER}-web" sh -c "node ace migration:rollback && node ace migration:run && node ace db:seed"
}

seed-users() {
    node ace db:seed --files "./database/seeders/01User.js"
}

seed-post() {
    node ace db:seed --files "./database/seeders/02Post.js"
}

seed-post-reaction() {
    node ace db:seed --files "./database/seeders/03PostReacton.js"
}

seed-post-comment() {
    node ace db:seed --files "./database/seeders/04PostComment.js"
}

generate-manifest() {
    node ace generate:manifest
}

generate-docs() {
    node ace docs:generate
}

build() {
    node ace build --production
}

# Help
help() {
    grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' "${BASH_SOURCE[0]}" \
        | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-24s\033[0m %s\n", $1, $2}' \
        | sed -e 's/\[32m## /[33m/' && printf "\n"
}

# Default
if [[ -z "$1" || "$1" == "help" ]]; then
    help
    exit 0
fi

# Execute the command
"$@"
