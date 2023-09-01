.PHONY: help
.DEFAULT_GOAL = help

CONTAINER = nubble

## —— Docker 🐳  ———————————————————————————————————————————————————————————————
docker-start: ## Iniciar Docker
	docker compose up -d

docker-build: ## Iniciar Docker com build
	docker compose up -d --build

docker-down: ## Desligar e Remove Docker
	docker compose down

docker-rebuild-all: ## Rebuild em todos os containers
	make docker-stop docker-build

docker-rebuild-postgres: ## Rebuild Postgres
	docker compose build --no-cache postgres

docker-web-shell: ## Acessar container do Node
	docker container exec -it $(CONTAINER)-web bash

docker-db-shell: ## Acessar container do postgres
	docker container exec -it $(CONTAINER)-postgres bash

## —— Adonis 🎶 ———————————————————————————————————————————————————————————————
watch: ## Iniciar Servidor Adonis
	node ace serve --watch

migration: ## Executar Migrations
	node ace migration:run

migration-docker: ## Executar Migrations no docker
	docker exec -ti $(CONTAINER)-web sh -c "make migration"

migration-test: ## Executar Teste de Migrations
	node ace migration:run --dry-run

migration-test-docker: ## Executar Teste de Migrations no docker
	docker exec -ti $(CONTAINER)-web sh -c "make migration-test"

rollback: ## Executar Rollback
	node ace migration:rollback

rollback-docker: ## Executar Rollback no docker
	docker exec -ti $(CONTAINER)-web sh -c "make rollback"

seed: ## Executar todos os Seeds
	node ace db:seed

seed-docker: ## Executar todos os Seeds no docker
	docker exec -ti $(CONTAINER)-web sh -c "make seed"

reset: ## Resetar banco de dados e rodar seeds
	make rollback migration seed

reset-docker: ## Resetar banco de dados e rodar seeds no docker
	docker exec -ti $(CONTAINER)-web sh -c "make reset"

seed-users: ## Executar Seed de User
	node ace db:seed --files "./database/seeders/01User.js"

seed-post: ## Executar Seed de Post
	node ace db:seed --files "./database/seeders/02Post.js"

seed-post-reaction: ## Executar Seed de Post Reaction
	node ace db:seed --files "./database/seeders/03PostReacton.js"

seed-post-comment: ## Executar Seed de Post Comment
	node ace db:seed --files "./database/seeders/04PostComment.js"

generate-manifest: ## Gerar Manifest Adonis
	node ace generate:manifest

generate-docs: ## Gerar Documentação Swagger
	node ace docs:generate

build: ## Iniciar Build Adonis
	node ace build --production

## —— Outros 🛠️️ ———————————————————————————————————————————————————————————————

help: ## Lista de commandos
	@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) \
	| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-24s\033[0m %s\n", $$1, $$2}' \
	| sed -e 's/\[32m## /[33m/' && printf "\n"
