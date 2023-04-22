import Logger from '@ioc:Adonis/Core/Logger'
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PostComments extends BaseSchema {
  protected tableName = 'post_comments'

  public async up() {
    if (!(await this.schema.hasTable(this.tableName)))
      this.schema.createTable(this.tableName, (table) => {
        table.increments('id')

        table.text('message').notNullable()
        table.uuid('user_id').unsigned().references('users.id').onDelete('CASCADE')
        table.integer('post_id').unsigned().references('posts.id').onDelete('CASCADE')

        table.boolean('is_deleted').defaultTo(false)
        table.timestamp('created_at', { useTz: true })
        table.timestamp('updated_at', { useTz: true })
        table.timestamp('deleted_at', { useTz: true })
      })
    else Logger.info('PostComments migration already running')
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
