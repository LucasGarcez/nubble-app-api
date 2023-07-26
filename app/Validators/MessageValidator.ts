import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export namespace MessageValidator {
  export class Store {
    public schema = schema.create({
      sender_id: schema.number([
        rules.exists({ table: 'users', column: 'id' })
      ]),
      recipient_id: schema.number([
        rules.exists({ table: 'users', column: 'id' })
      ]),
      message: schema.string(),
    })
  }

  export class Update {
    public schema = schema.create({
      message: schema.string(),
    })
  }
}
