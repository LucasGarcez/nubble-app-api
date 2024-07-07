#!/bin/bash

CONTAINER="nubble"

docker_install() {
    cp .env.example .env \
    && docker_build migration_docker reset_docker generate_docs_docker \
    && yarn
}

docker_start() {
    docker compose up -d
}

docker_build() {
    docker compose up -d --build
}

docker_stop() {
    docker compose down
}

docker_restart() {
    docker_stop
    docker_start
}

docker_rebuild() {
    docker_stop
    docker_build
}

docker_rebuild_postgres() {
    docker compose build --no-cache postgres
}

docker_web_shell() {
    docker container exec -it ${CONTAINER}-web bash
}

docker_db_shell() {
    docker container exec -it ${CONTAINER}-postgres bash
}

watch() {
    node ace serve --watch
}

migration() {
    node ace migration:run
}

migration_docker() {
    docker exec -ti ${CONTAINER}-web sh -c "migration"
}

migration_test() {
    node ace migration:run --dry-run
}

migration_test_docker() {
    docker exec -ti ${CONTAINER}-web sh -c "migration_test"
}

rollback() {
    node ace migration:rollback
}

rollback_docker() {
    docker exec -ti ${CONTAINER}-web sh -c "rollback"
}

seed() {
    node ace db:seed
}

seed_docker() {
    docker exec -ti ${CONTAINER}-web sh -c "seed"
}

reset() {
    rollback
    migration
    seed
}

reset_docker() {
    docker exec -ti ${CONTAINER}-web sh -c "reset"
}

generate_manifest() {
    node ace generate:manifest
}

generate_docs() {
    node ace docs:generate
}

generate_docs_docker() {
    docker exec -ti ${CONTAINER}-web sh -c "generate_docs"
}

build() {
    node ace build --production
}

help() {
    echo "Available commands:"
    declare -F | awk '{print $3}' | grep -v "^_" | while read -r line ; do
        echo "  - $line"
    done
}

"$@"
