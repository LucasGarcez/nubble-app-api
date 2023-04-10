import {
  beforeSave,
  belongsTo,
  BelongsTo,
  column,
  ModelQueryBuilderContract,
  scope,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import HubEvent from 'App/Modules/HubEvent/Models/HubEvent'
import Post from 'App/Modules/Timeline/Models/Post'
import User from 'App/Modules/User/Models/User'
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
   * - define post reaction model relationships
   */
  @belongsTo(() => User, { foreignKey: 'user_id' })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Post, { foreignKey: 'post_id' })
  public post: BelongsTo<typeof Post>

  @belongsTo(() => HubEvent, {
    localKey: 'id',
    foreignKey: 'hub_event_id',
    onQuery(query) {
      query.where({ is_deleted: false })
    },
  })
  public hub_event: BelongsTo<typeof HubEvent>

  /**
   * ------------------------------------------------------
   * Hooks
   * ------------------------------------------------------
   */
  @beforeSave()
  public static async addEvent(model: Post): Promise<void> {
    await super.addEvent(model, true)
  }

  /**
   * ------------------------------------------------------
   * Query Scopes
   * ------------------------------------------------------
   */
  public static loadUser = scope((query: ModelQueryBuilderContract<typeof PostReaction>) => {
    query.preload('user', (builder) => {
      builder.select(User.sensitiveSerializer)
    })
  })

  /**
   * ------------------------------------------------------
   * Misc
   * ------------------------------------------------------
   */
  public serializeExtras = true
}
