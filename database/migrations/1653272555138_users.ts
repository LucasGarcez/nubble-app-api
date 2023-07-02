import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'
  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table.string('first_name', 80).notNullable()
      table.string('last_name', 80).notNullable()
      table.string('username', 50).notNullable().unique()
      table.string('email', 255).notNullable().unique()
      table.string('password', 180).notNullable()

      table.boolean('is_online').notNullable().defaultTo(false)
      table.boolean('is_blocked').notNullable().defaultTo(false)
      table.boolean('is_deleted').notNullable().defaultTo(false)

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
      table.timestamp('deleted_at', { useTz: true }).defaultTo(null)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
