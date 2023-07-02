import { belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Post from 'App/Models/Post'
import User from 'App/Models/User'
import BaseModel from 'App/Shared/Models/BaseModel'

export default class PostContent extends BaseModel {
  public static table = 'post_contents'

  /**
   * ------------------------------------------------------
   * Columns
   * ------------------------------------------------------
   * - column typing struct
   */
  @column({ isPrimary: true })
  public id: number

  @column()
  public content_url: string

  @column()
  public content_thumb_url: string

  @column()
  public type: string

  @column()
  public subtype: string

  @column()
  public width: number

  @column()
  public height: number

  @column({ serializeAs: null })
  public order: number

  @column({ serializeAs: null })
  public user_id: number

  @column({ serializeAs: null })
  public post_id: number

  @column()
  public hub_event_id: number | null

  @column({ serializeAs: null })
  public is_deleted: boolean

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updated_at: DateTime

  @column.dateTime({ serializeAs: null })
  public deleted_at: DateTime

  /**
   * ------------------------------------------------------
   * Relationships
   * ------------------------------------------------------
   * - define post content model relationships
   */
  @belongsTo(() => User, { foreignKey: 'user_id' })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Post, { foreignKey: 'post_id' })
  public post: BelongsTo<typeof Post>
  /**
   * ------------------------------------------------------
   * Hooks
   * ------------------------------------------------------
   */

  /**
   * ------------------------------------------------------
   * Query Scopes
   * ------------------------------------------------------
   */

  /**
   * ------------------------------------------------------
   * Misc
   * ------------------------------------------------------
   */
}
