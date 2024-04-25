import {
  belongsTo,
  BelongsTo,
  column,
  ModelQueryBuilderContract,
  scope,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import Post from 'App/Models/Post'
import User from 'App/Models/User'
import BaseModel from 'App/Shared/Models/BaseModel'

export default class PostReaction extends BaseModel {
  public static table = 'post_reactions'

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
  public post_id: number

  @column()
  public hub_event_id: number | null

  @column()
  public is_checked: boolean

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
   * - define post reaction model relationships
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
  public static loadUser = scope((query: ModelQueryBuilderContract<typeof PostReaction>) => {
    query.preload('user', (builder) => {
      builder.select(['id', 'first_name', 'last_name', 'username', 'email', 'profile_url', 'is_online'])
    })
  })

  public static loadPost = scope((query: ModelQueryBuilderContract<typeof PostReaction>) => {
    query.preload('post', (builder) => {
      builder.select(['id', 'text', 'image_url'])
    })
  })

  public static loadPostUser = scope((query: ModelQueryBuilderContract<typeof PostReaction>) => {
    query.preload('post', (builder) => {
      builder.select(['id', 'text', 'image_url', 'user_id'])
      builder.preload('user', (builder) => {
        builder.select(['id', 'first_name', 'last_name', 'username', 'email', 'profile_url', 'is_online'])
      })
    })
  })

  /**
   * ------------------------------------------------------
   * Misc
   * ------------------------------------------------------
   */
  public serializeExtras = true
}
