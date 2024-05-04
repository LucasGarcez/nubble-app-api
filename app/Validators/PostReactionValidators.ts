import { rules, schema } from '@ioc:Adonis/Core/Validator'

export namespace PostReactionValidators {
  export class StoreUpdate {
    public schema = schema.create({
      post_id: schema.number([rules.exists({ table: 'posts', column: 'id' })]),
      user_id: schema.number([rules.exists({ table: 'users', column: 'id' })]),
      emoji_type: schema.enum(['like', 'favorite']),
    })
  }

  export class Delete {
    public schema = schema.create({
      post_id: schema.number([rules.exists({ table: 'posts', column: 'id' })]),
      user_id: schema.number([rules.exists({ table: 'users', column: 'id' })]),
      emoji_type: schema.enum(['like', 'favorite']),
    })
  }
}
