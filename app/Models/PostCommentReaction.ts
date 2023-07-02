import {
  belongsTo,
  BelongsTo,
  column,
  ModelQueryBuilderContract,
  scope,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import PostComment from 'App/Models/PostComment'
import User from 'App/Models/User'
import BaseModel from 'App/Shared/Models/BaseModel'

export default class PostCommentReaction extends BaseModel {
  public static table = 'post_comment_reactions'

  /**
   * ------------------------------------------------------
   * Columns
   * ------------------------------------------------------
   * - column typing struct
   */
  @column({ isPrimary: true })
  public id: number

  @column()
  public emoji_type: string

  @column()
  public user_id: number

  @column()
  public post_comment_id: number

  @column()
  public hub_event_id: number | null

  @column({ serializeAs: null })
  public is_deleted: boolean

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @column.dateTime({ serializeAs: null })
  public deleted_at: DateTime

  /**
   * ------------------------------------------------------
   * Relationships
   * ------------------------------------------------------
   * - define post comment reaction model relationships
   */
  @belongsTo(() => User, { foreignKey: 'user_id' })
  public user: BelongsTo<typeof User>

  @belongsTo(() => PostComment, { foreignKey: 'post_comment_id' })
  public comment: BelongsTo<typeof PostComment>

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
  public static loadUser = scope((query: ModelQueryBuilderContract<typeof PostCommentReaction>) => {
    query.preload('user')
  })

  /**
   * ------------------------------------------------------
   * Misc
   * ------------------------------------------------------
   */
  public serializeExtras = true
}
