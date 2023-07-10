## Configuração de Ambiente

#### Instalar o docker

https://www.docker.com/

#### Instalar Beekeeper Studio (Community Edition)

https://github.com/beekeeper-studio/beekeeper-studio

#### Rodar o docker

```
docker run -d --name nubble-database -p 5432:5432 -e POSTGRES_PASSWORD=123456 postgres
```

#### Instalar dependências

```
yarn
```

#### Criar Banco de Dados

Conectar PostgreSQL através do beekeeper studio e criar DB com o nome de **nubble_db_development**

#### Resetar banco de dados e rodar seeds

```
yarn reset
```

## Rodar o projeto

#### Arquivo .env
Criei um arquivo como o nome de `.env` na raiz do projeto:

```
# App
PORT=3333
HOST=0.0.0.0
NODE_ENV=development
APP_KEY=nNXnQq0_HbeqMI3V2iibFcpfb_Ci2fJN
DRIVE_DISK=local
DB_CONNECTION=pg

# Database
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=123456
PG_DB_NAME=nubble_db_development
```

#### Ligar servidor
Rode o comando abaixo para poder conectar a API, o terminal deve ficar aberto com o processo rodando o tempo todo.
```
yarn dev
```

#### Acesse a documentação da API (Swagger)

http://localhost:3333/docs
