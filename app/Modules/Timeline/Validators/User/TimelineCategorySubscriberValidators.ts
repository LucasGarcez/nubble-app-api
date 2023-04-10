import { schema, rules } from '@ioc:Adonis/Core/Validator'

import { BaseValidator } from 'App/Shared/Validators/BaseValidator'

export namespace TimelineCategorySubscriberValidators {
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
          table: 'timeline_category_subscribers',
          column: 'timeline_category_id',
          where: {
            user_id: this.ctx.currentUser ? this.ctx.currentUser.id : null,
          },
          whereNot: {
            is_deleted: true,
          },
        }),
      ]),
      active_notification: schema.boolean.optional(),
    })
  }

  export class Update extends BaseValidator {
    public schema = schema.create({
      active_notification: schema.boolean.optional(),
    })
  }
}
