import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CreateMessagesTable extends BaseSchema {
  protected tableName = 'messages'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('sender_id').unsigned().notNullable()
      table.integer('recipient_id').unsigned().notNullable()
      table.text('message').notNullable()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
