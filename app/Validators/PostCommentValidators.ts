import { rules, schema } from '@ioc:Adonis/Core/Validator'

export namespace PostCommentValidators {
  export class Store {
    public schema = schema.create({
      post_id: schema.number(),
      reply_comment_id: schema.number.optional([
        rules.exists({ table: 'post_comments', column: 'id' }),
      ]),
      message: schema.string(),
    })
  }

  export class Update {
    public schema = schema.create({
      message: schema.string(),
    })
  }
}
