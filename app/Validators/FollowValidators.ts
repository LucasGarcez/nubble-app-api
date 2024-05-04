import { rules, schema } from '@ioc:Adonis/Core/Validator'

export namespace FollowValidators {
  export class Create {
    public schema = schema.create({
      followed_user_id: schema.number([rules.exists({ table: 'users', column: 'id' })]),
    })
  }
}
