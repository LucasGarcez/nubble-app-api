import { rules, schema } from '@ioc:Adonis/Core/Validator'

import { BaseValidator } from 'App/Shared/Validators/BaseValidator'

export namespace PostValidators {
  export class Store extends BaseValidator {
    public schema = schema.create({
      text: schema.string({ trim: true }, []),
      timeline_category_id: schema.number.optional([
        rules.exists({
          table: 'timeline_categories',
          column: 'id',
          whereNot: { is_deleted: true },
        }),
      ]),
      partner_ids: schema.array
        .optional()
        .members(
          schema.number([
            rules.exists({ table: 'partners', column: 'id', where: { active: true } }),
          ])
        ),
      send_notification: schema.boolean.optional([]),
      schedule_date: schema.date.optional({}, [rules.after(1, 'minute')]),
      is_fixed: schema.boolean.optional([]),
      fixed_date: schema.date.optional({}, [rules.after(1, 'minute')]),
      is_activated: schema.boolean.optional([
        rules.requiredWhen('schedule_date', '=', null),
        rules.requiredWhen('schedule_date', '=', ''),
      ]),
      contents: schema.array.optional([]).members(
        schema.object().members({
          content_url: schema.string({ trim: true }, []),
          content_thumb_url: schema.string.optional({ trim: true }, []),
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
      text: schema.string.optional({ trim: true }, []),
      timeline_category_id: schema.number.optional([
        rules.exists({
          table: 'timeline_categories',
          column: 'id',
          whereNot: { is_deleted: true },
        }),
      ]),
      partner_ids: schema.array
        .optional()
        .members(
          schema.number([
            rules.exists({ table: 'partners', column: 'id', where: { active: true } }),
          ])
        ),
      send_notification: schema.boolean.optional([]),
      schedule_date: schema.date.optional(),
      is_fixed: schema.boolean.optional([]),
      fixed_date: schema.date.optional(),
      is_activated: schema.boolean.optional([
        rules.requiredWhen('schedule_date', '=', null),
        rules.requiredWhen('schedule_date', '=', ''),
      ]),
      contents: schema.array.optional([]).members(
        schema.object().members({
          id: schema.number.optional([
            rules.exists({ table: 'post_contents', column: 'id', whereNot: { is_deleted: true } }),
          ]),
          content_url: schema.string({ trim: true }, []),
          content_thumb_url: schema.string.optional({ trim: true }, []),
          width: schema.number.optional([]),
          height: schema.number.optional([]),
          type: schema.enum(['video', 'image'] as const),
          subtype: schema.string.optional({ trim: true }, []),
        })
      ),
    })
  }
}
