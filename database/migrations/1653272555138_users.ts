import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Logger from '@ioc:Adonis/Core/Logger'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    if (!(await this.schema.hasTable(this.tableName)))
      this.schema.createTable(this.tableName, (table) => {
        table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)

        table.string('first_name', 80).notNullable().index('user_first_name_index')
        table.string('last_name', 80).notNullable().index('user_last_name_index')
        table.string('username', 50).notNullable().unique().index('username_index')
        table.string('email', 255).notNullable().unique().index('user_email_index')
        table.string('password', 180).notNullable()

        table.string('remember_me_token').nullable()

        table.boolean('is_online').notNullable().defaultTo(false)
        table.boolean('is_blocked').notNullable().defaultTo(false)
        table.boolean('is_deleted').notNullable().defaultTo(false)

        table.timestamp('created_at', { useTz: true }).notNullable()
        table.timestamp('updated_at', { useTz: true }).notNullable()
        table.timestamp('deleted_at', { useTz: true }).defaultTo(null)
      })
    else Logger.info('Users migration already running')
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
