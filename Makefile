.PHONY: help
.DEFAULT_GOAL = help

CONTAINER = nubble-web

## —— Docker 🐳  ———————————————————————————————————————————————————————————————
docker-start: ## Iniciar Docker
	docker compose up -d

docker-down: ## Desligar Docker
	docker compose down

docker-rebuild-all: ## Rebuild em todos os containers
	docker compose down && docker compose up -d --build

docker-rebuild-postgres: ## Rebuild Postgres
	docker compose build --no-cache postgres

docker-web-shell: ## Acessar container do Node
	docker container exec -it $(CONTAINER)-web bash

docker-postgres-shell: ## Acessar container do postgres
	docker container exec -it $(CONTAINER)-postgres bash

## —— Adonis 🎶 ———————————————————————————————————————————————————————————————
adonis-watch: ## Iniciar Servidor Adonis
	node ace serve --watch

adonis-migration: ## Iniciar Migration Adonis
	node ace migration:run

adonis-migration-all: ## Iniciar Migration Adonis
	node ace migration:rollback && node ace migration:run

adonis-migration-test: ## Iniciar Teste de Migration Adonis
	node ace migration:run --dry-run

adonis-rollback: ## Iniciar Rollback da Migration Adonis
	node ace migration:rollback

adonis-build: ## Iniciar Build Adonis
	node ace build --production

adonis-seed-all: ## Executar todos os Seeds
	node ace db:seed

adonis-seed-users: ## Executar Seed de User
	node ace db:seed --files "./database/seeders/01User.js"

adonis-seed-post: ## Executar Seed de Post
	node ace db:seed --files "./database/seeders/02Post.js"

adonis-seed-post-reaction: ## Executar Seed de Post Reaction
	node ace db:seed --files "./database/seeders/03PostReacton.js"

adonis-seed-post-comment: ## Executar Seed de Post Comment
	node ace db:seed --files "./database/seeders/04PostComment.js"

adonis-generate-manifest: ## Gerar Manifest Adonis
	node ace generate:manifest

## —— Outros 🛠️️ ———————————————————————————————————————————————————————————————

help: ## Lista de commandos
	@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) \
	| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-24s\033[0m %s\n", $$1, $$2}' \
	| sed -e 's/\[32m## /[33m/' && printf "\n"
