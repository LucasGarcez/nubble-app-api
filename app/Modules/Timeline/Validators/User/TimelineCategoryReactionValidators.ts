import { schema, rules } from '@ioc:Adonis/Core/Validator'

import { BaseValidator } from 'App/Shared/Validators/BaseValidator'

export namespace TimelineCategoryReactionValidators {
  export class Store extends BaseValidator {
    public schema = schema.create({
      timeline_category_id: schema.number([
        rules.exists({
          table: 'timeline_categories',
          column: 'id',
          whereNot: {
            is_deleted: true,
          },
        }),
        rules.unique({
          table: 'timeline_category_reactions',
          column: 'timeline_category_id',
          whereNot: {
            is_deleted: true,
          },
          where: {
            user_id: this.ctx.currentUser ? this.ctx.currentUser.id : null,
          },
        }),
      ]),
      emoji_type: schema.string(),
    })
  }
}
