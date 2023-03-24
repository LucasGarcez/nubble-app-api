import BaseModel from 'App/Shared/Models/BaseModel'
import { beforeSave, column, ModelQueryBuilderContract, scope } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

export default class Role extends BaseModel {
  public static table = 'roles'

  /**
   * ------------------------------------------------------
   * Columns
   * ------------------------------------------------------
   * - column typing struct
   */
  @column({ isPrimary: true })
  public id: string

  @column()
  public slug: string

  @column({ serializeAs: null })
  public name: string

  @column()
  public description: string

  @column()
  public deletable: boolean

  @column()
  public is_active: boolean

  @column({ serializeAs: null })
  public is_deleted: boolean

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updated_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public deleted_at: DateTime

  /**
   * ------------------------------------------------------
   * Hooks
   * ------------------------------------------------------
   */
  @beforeSave()
  public static lowerName(role: Role): void {
    if (role.$dirty.slug) role.name = role.slug.toLowerCase()
  }

  /**
   * ------------------------------------------------------
   * Relationships
   * ------------------------------------------------------
   * - define Role model relationships
   */

  /**
   * ------------------------------------------------------
   * Query Scopes
   * ------------------------------------------------------
   */
  public static searchQueryScope = scope((query, search) => {
    const fields = ['slug', 'description']
    let sql = ''

    fields.forEach((field, i) => {
      sql = `${sql} ${i !== 0 ? ' or ' : ' '} ${field} ilike '%${search}%'`
    })

    return query.whereRaw(`(${sql})`)
  })

  public static hideRoot = scope((query: ModelQueryBuilderContract<typeof Role>) =>
    query.andWhereNot('name', 'root')
  )

  /**
   * ------------------------------------------------------
   * Misc
   * ------------------------------------------------------
   */
}
