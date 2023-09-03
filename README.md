## Configuração de Ambiente
### Instalar o docker

https://www.docker.com/

### Instalar Beekeeper Studio (Community Edition)

https://github.com/beekeeper-studio/beekeeper-studio


### Iniciar Backend

**1. Criar arquivo .env** 
Criei um arquivo como o nome de `.env` na raiz do projeto. Dentro desse arquivo, copie e cole o conteúdo que está dentro do arquivo [.env.example](./.env.example).

**2. Instalar dependências**
```shell script
# Instalar dependências de desenvolvimento
yarn
```

**2. Iniciar Docker Containers**
```shell script
# Iniciar containers
make docker-start
```
Abra o Docker Dashboard para verificar se todos os containers foram criados.
![docker images](./docs/images/docker-containers.png)
**3. Conectar Banco de dados**
Chegou a hora de conectar o banco de dados. Abra o Beekeeper Studio e crie uma nova conexão.

- Selecione Postgres
- Mantenha Host (localhost) e Port padrão (5432)
- Credenciais
     Campo | Valor
    --- | ---
    User | nubble
    Password | nubble
    Default Database | nubble_db_development
- Dê um nove para a conexão. Ex "Nubble" e pressione "Save".

**4. Criar tabelas e popular o banco de dados**

```shell script
# Resetar banco de dados e rodar seeds
make reset-docker
```

**5. Pronto! A Nubble API está pronta para uso**

Aplicações | URL
--- | ---
App - NodeJs | <http://localhost:3333>
Documentação - Swagger | <http://localhost:3333/docs>
Postgres - pgAdmin | <http://localhost:8030>
E-mail - Mailpit | <http://localhost:8040>

### Tecnologias Utilizada


- [Docker][l-docker]
- [NodeJs v18.17.0][l-nodejs]
- [Adonis v5][l-adonis]
- [Postgres v14][l-postgres]
- [pgAdmin][l-pgadmin]
- [Mailtip][l-mailpit]
- [Adonis Auto Swagger][l-swagger]


[l-docker]: https://www.docker.com
[l-nodejs]: https://nodejs.org
[l-adonis]: https://adonisjs.com
[l-postgres]: https://hub.docker.com/_/postgres
[l-pgadmin]: https://www.pgadmin.org
[l-mailpit]: https://github.com/axllent/mailpit
[l-swagger]: https://github.com/ad-on-is/adonis-autoswagger
