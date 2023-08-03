# Configuração de Ambiente

- [Docker][l-docker]
- [NodeJs v18.17.0][l-nodejs]
- [Adonis v5][l-adonis]
- [Postgres v14][l-postgres]
- [pgAdmin][l-pgadmin]
- [Mailtip][l-mailpit]
- [Adonis Auto Swagger][l-swagger]

---

Aplicações | URL
--- | ---
App - NodeJs | <http://localhost:3333>
Documentação - Swagger | <http://localhost:3333/docs>
Postgres - pgAdmin | <http://localhost:8030>
E-mail - Mailpit | <http://localhost:8040>

---

>1. A Aplicação NodeJs será executada dentro de um container docker chamado.
>2. Este container irá rodar na porta(`3333`)  definida no arquivo .env ou também poderá ser executado localmente, vai da preferência do desenvolvedor.
>3. Detalhes do banco de dados podem ser visualizados no arquivo `.env.exemplo`

---

```shell script
# Instalar dependências de desenvolvimento
yarn
```

```shell script
# Iniciar containers
make docker-start
```

```shell script
# Iniciar containers com build
make docker-build
```

```shell script
# Resetar banco de dados e rodar seeds
make reset-docker
```

```shell script
# Lista de todos os comandos disponíveis
# Arquivo Makefile
make help
```

[l-docker]: https://www.docker.com
[l-nodejs]: https://nodejs.org
[l-adonis]: https://adonisjs.com
[l-postgres]: https://hub.docker.com/_/postgres
[l-pgadmin]: https://www.pgadmin.org
[l-mailpit]: https://github.com/axllent/mailpit
[l-swagger]: https://github.com/ad-on-is/adonis-autoswagger
