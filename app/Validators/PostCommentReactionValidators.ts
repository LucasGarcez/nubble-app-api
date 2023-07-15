import { rules, schema } from '@ioc:Adonis/Core/Validator'

export namespace PostCommentReactionValidators {
  export class Store {
    public schema = schema.create({
      post_comment_id: schema.number([
        rules.exists({ table: 'post_comments', column: 'id' }),
        // rules.unique({
        //   table: 'post_comment_reactions',
        //   column: 'post_comment_id',
        //   where: {
        //     user_id: schema.number([rules.exists({ table: 'users', column: 'id' })]),
        //     is_deleted: false,
        //   },
        // }),
      ]),
      emoji_type: schema.string(),
    })
  }

  export class Update {
    public schema = schema.create({
      post_comment_id: schema.number([rules.exists({ table: 'post_comments', column: 'id' })]),
      emoji_type: schema.string(),
    })
  }
}
