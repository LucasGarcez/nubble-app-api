import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BaseQueries extends BaseSchema {
  public async up() {
    await this.db.rawQuery('create extension if not exists "uuid-ossp";').knexQuery
  }

  public async down() {
    this.schema.raw('drop extension "uuid-ossp";')
  }
}
