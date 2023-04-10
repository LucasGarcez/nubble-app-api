import { rules, schema } from '@ioc:Adonis/Core/Validator'

import { BaseValidator } from 'App/Shared/Validators/BaseValidator'

export namespace PostCommentValidators {
  export class Store extends BaseValidator {
    public schema = schema.create({
      post_id: schema.number(),
      reply_comment_id: schema.number.optional([
        rules.exists({ table: 'post_comments', column: 'id' }),
      ]),
      message: schema.string(),
    })
  }

  export class Update extends BaseValidator {
    public schema = schema.create({
      message: schema.string(),
    })
  }
}
