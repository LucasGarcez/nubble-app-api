import { rules, schema } from '@ioc:Adonis/Core/Validator'

import { BaseValidator } from 'App/Shared/Validators/BaseValidator'

export namespace PostValidators {
  export class Store extends BaseValidator {
    public schema = schema.create({
      text: schema.string.optional({ trim: true }, []),
      timeline_category_id: schema.number.optional(),
      contents: schema.array().members(
        schema.object().members({
          content_url: schema.string({}, []),
          content_thumb_url: schema.string.optional({}, []),
          width: schema.number.optional([]),
          height: schema.number.optional([]),
          type: schema.enum(['video', 'image'] as const),
          subtype: schema.string.optional({ trim: true }, []),
        })
      ),
    })
  }

  export class Update extends BaseValidator {
    public schema = schema.create({
      text: schema.string.optional(),
      contents: schema.array.optional().members(
        schema.object().members({
          id: schema.number.optional(),
          content_url: schema.string(),
          content_thumb_url: schema.string.optional(),
          width: schema.number.optional(),
          height: schema.number.optional(),
          type: schema.enum(['video', 'image'] as const),
          subtype: schema.string.optional(),
        })
      ),
    })
  }

  /** --- validators --- */
  export function Integer(id: number | string) {
    return {
      schema: Schemas.Integer,
      data: { id: Number(id) },
      messages: {
        number: 'Parâmetro invalido',
        exists: 'Postagem está inacessível ou desativada.',
      },
    }
  }

  /** --- schemas --- */
  export namespace Schemas {
    export const Integer = schema.create({
      id: schema.number([
        rules.unsigned(),
        rules.exists({ table: 'posts', column: 'id', whereNot: { is_deleted: true } }),
      ]),
    })

    export const UUID = schema.create({
      id: schema.string.optional({ trim: true, escape: true }, [
        rules.uuid({ version: '4' }),
        rules.exists({ table: 'posts', column: 'id', whereNot: { is_deleted: true } }),
        rules.regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
      ]),
    })
  }
}
