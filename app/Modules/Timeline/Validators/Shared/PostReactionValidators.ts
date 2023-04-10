import { rules, schema } from '@ioc:Adonis/Core/Validator'

import { BaseValidator } from 'App/Shared/Validators/BaseValidator'

export namespace PostReactionValidators {
  export class Store extends BaseValidator {
    public schema = schema.create({
      post_id: schema.number([
        rules.unique({
          table: 'post_reactions',
          column: 'post_id',
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
      post_id: schema.number([rules.exists({ table: 'posts', column: 'id' })]),
      emoji_type: schema.string(),
    })
  }
}
