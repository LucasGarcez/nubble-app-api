import { rules, schema } from '@ioc:Adonis/Core/Validator'

export namespace PostReactionValidators {
  export class Store {
    public schema = schema.create({
      post_id: schema.number([
        rules.unique({
          table: 'post_reactions',
          column: 'post_id',
          where: {
            user_id: schema.number([rules.exists({ table: 'users', column: 'id' })]),
            is_deleted: false,
          },
        }),
      ]),
      emoji_type: schema.string(),
    })
  }

  export class Update {
    public schema = schema.create({
      post_id: schema.number([rules.exists({ table: 'posts', column: 'id' })]),
      emoji_type: schema.string(),
    })
  }
}
