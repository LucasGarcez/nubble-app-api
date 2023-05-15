import { DateTime } from 'luxon'
import { column, scope } from '@ioc:Adonis/Lucid/Orm'

import BaseModel from 'App/Shared/Models/BaseModel'

export default class Post extends BaseModel {
  public static table = 'posts'

  /**
   * ------------------------------------------------------
   * Columns
   * ------------------------------------------------------
   * - column typing struct
   */
  @column({ isPrimary: true })
  public id: string

  @column()
  public text: string

  @column()
  public user_id: string

  @column({ serializeAs: null })
  public is_deleted: boolean

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updated_at: DateTime

  @column.dateTime({ autoUpdate: true, serializeAs: null })
  public deleted_at: DateTime

  /**
   * ------------------------------------------------------
   * Hooks
   * ------------------------------------------------------
   */

  /**
   * ------------------------------------------------------
   * Relationships
   * ------------------------------------------------------
   * - define Post model relationships
   */

  /**
   * ------------------------------------------------------
   * Query Scopes
   * ------------------------------------------------------
   */
  public static searchQueryScope = scope((query, search) => {
    const fields = ['text']
    let sql = ''

    fields.forEach(
      (field, i) => (sql = `${sql} ${i !== 0 ? ' or ' : ' '} ${field} ilike '%${search}%'`)
    )

    return query.whereRaw(`(${sql})`)
  })

  /**
   * ------------------------------------------------------
   * Misc
   * ------------------------------------------------------
   */
}
