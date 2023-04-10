import { schema, rules } from '@ioc:Adonis/Core/Validator'

import { BaseValidator } from 'App/Shared/Validators/BaseValidator'

export namespace TimelineCategoryValidators {
  export class Store extends BaseValidator {
    public schema = schema.create({
      title: schema.object().anyMembers(),
      description: schema.object().anyMembers(),
      banner_url: schema.string.optional(),
      view_type: schema.enum(['public', 'private', 'hide'] as const),
      is_default: schema.boolean.optional(),
      allow_post: schema.boolean.optional(),
      allow_subscriber: schema.boolean.optional(),
      order: schema.number.optional([rules.unsigned()]),
      group_ids: schema
        .array()
        .members(schema.number([rules.exists({ table: 'groups', column: 'id' })])),
    })
  }

  export class Update extends BaseValidator {
    public schema = schema.create({
      title: schema.object.optional().anyMembers(),
      description: schema.object.optional().anyMembers(),
      banner_url: schema.string.optional(),
      view_type: schema.enum.optional(['public', 'private', 'hide'] as const),
      is_default: schema.boolean.optional(),
      allow_post: schema.boolean.optional(),
      allow_subscriber: schema.boolean.optional(),
      order: schema.number.optional([rules.unsigned()]),
      group_ids: schema
        .array()
        .members(schema.number([rules.exists({ table: 'groups', column: 'id' })])),
    })
  }
}
