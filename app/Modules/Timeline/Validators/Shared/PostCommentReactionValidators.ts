import { rules, schema } from '@ioc:Adonis/Core/Validator'

import { BaseValidator } from 'App/Shared/Validators/BaseValidator'

export namespace PostCommentReactionValidators {
  export class Store extends BaseValidator {
    public schema = schema.create({
      post_comment_id: schema.number([
        rules.exists({ table: 'post_comments', column: 'id' }),
        rules.unique({
          table: 'post_comment_reactions',
          column: 'post_comment_id',
          where: {
            user_id: this.ctx.currentUser ? this.ctx.currentUser.id : null,
            is_deleted: false,
          },
        }),
      ]),
      emoji_type: schema.string(),
    })
  }

  export class Update extends BaseValidator {
    public schema = schema.create({
      post_comment_id: schema.number([rules.exists({ table: 'post_comments', column: 'id' })]),
      emoji_type: schema.string(),
    })
  }
}
