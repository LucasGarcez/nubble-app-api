import {
  beforeSave,
  belongsTo,
  BelongsTo,
  column,
  hasMany,
  HasMany,
  ModelQueryBuilderContract,
  scope,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import HubEvent from 'App/Modules/HubEvent/Models/HubEvent'
import Post from 'App/Modules/Timeline/Models/Post'
import PostCommentReaction from 'App/Modules/Timeline/Models/PostCommentReaction'
import User from 'App/Modules/User/Models/User'
import BaseModel from 'App/Shared/Models/BaseModel'

export default class PostComment extends BaseModel {
  public static table = 'post_comments'

  /**
   * ------------------------------------------------------
   * Columns
   * ------------------------------------------------------
   * - column typing struct
   */
  @column({ isPrimary: true })
  public id: number

  @column()
  public message: string

  @column()
  public user_id: number

  @column()
  public post_id: number

  @column()
  public reply_comment_id: number

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
   * - define post comment model relationships
   */
  @belongsTo(() => User, { foreignKey: 'user_id' })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Post, { foreignKey: 'post_id' })
  public post: BelongsTo<typeof Post>

  @belongsTo(() => PostComment, { foreignKey: 'reply_comment_id' })
  public replied: BelongsTo<typeof PostComment>

  @belongsTo(() => HubEvent, {
    localKey: 'id',
    foreignKey: 'hub_event_id',
    onQuery(query) {
      query.where({ is_deleted: false })
    },
  })
  public hub_event: BelongsTo<typeof HubEvent>

  @hasMany(() => PostComment, { foreignKey: 'reply_comment_id' })
  public replies: HasMany<typeof PostComment>

  @hasMany(() => PostCommentReaction, { foreignKey: 'post_comment_id' })
  public reactions: HasMany<typeof PostCommentReaction>

  @hasMany(() => PostCommentReaction, { foreignKey: 'post_comment_id' })
  public reaction_count: HasMany<typeof PostCommentReaction>

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
  public static loadUser = scope((query: ModelQueryBuilderContract<typeof PostComment>) => {
    query.preload('user', (builder) => {
      builder.select(User.sensitiveSerializer)
    })
  })

  public static loadReply = scope((query: ModelQueryBuilderContract<typeof PostComment>) => {
    query.preload('replied', (builder) => {
      builder.withScopes((scopes) => {
        scopes.loadUser()
      })
    })
  })

  public static loadReplyCount = scope((query: ModelQueryBuilderContract<typeof PostComment>) => {
    query.withCount('replies', (query) => {
      query.where('is_deleted', false)
    })
  })

  public static reactionCount = scope((query: ModelQueryBuilderContract<typeof PostComment>) => {
    query
      .preload('reaction_count', (builder) => {
        builder.select('emoji_type').groupBy('emoji_type', 'post_comment_id').count('*')
      })
      .withCount('reactions', (builder) => {
        builder.where('is_deleted', false).as('post_reactions_count')
      })
  })

  public static loadAlreadyReact = scope(
    (query: ModelQueryBuilderContract<typeof PostComment>, userId: number) => {
      query.withAggregate('reactions', (builder) => {
        builder
          .max('emoji_type')
          .where('user_id', userId)
          .where('is_deleted', false)
          .groupBy('id', 'user_id', 'post_comment_id', 'emoji_type')
          .orderBy('id', 'desc')
          .limit(1)
          .as('already_reacted')
      })
    }
  )

  /**
   * ------------------------------------------------------
   * Misc
   * ------------------------------------------------------
   */
  public serializeExtras = true
}
