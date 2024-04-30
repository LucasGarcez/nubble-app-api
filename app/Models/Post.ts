import {
  belongsTo,
  BelongsTo,
  column,
  computed,
  hasMany,
  HasMany,
  ModelQueryBuilderContract,
  scope,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import PostComment from 'App/Models/PostComment'
import PostContent from 'App/Models/PostContent'
import PostReaction from 'App/Models/PostReaction'
import BaseModel from 'App/Shared/Models/BaseModel'
import User from './User'
import Follow from './Follow'

export default class Post extends BaseModel {
  public static table = 'posts'

  @column({ isPrimary: true })
  public id: number

  @column()
  public text: string

  @column()
  public user_id: number

  @column({ columnName: 'image_url' })
  public imageUrl: string

  @computed()
  // @no-swagger
  public get status() {
    if (!this.is_activated) return 'disabled'
    else return 'published'
  }

  @column()
  public is_fixed: boolean

  @column()
  public is_activated: boolean

  @column({ serializeAs: null })
  // @no-swagger
  public is_deleted: boolean

  @column.dateTime({ autoCreate: true })
  // @no-swagger
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  // @no-swagger
  public updated_at: DateTime

  @column.dateTime({ serializeAs: null })
  // @no-swagger
  public deleted_at: DateTime

  @belongsTo(() => User, { foreignKey: 'user_id' })
  public user: BelongsTo<typeof User>

  /** has-many relationships */
  @hasMany(() => PostContent, { foreignKey: 'post_id' })
  public contents: HasMany<typeof PostContent>

  @hasMany(() => PostReaction, { foreignKey: 'post_id' })
  public reactions: HasMany<typeof PostReaction>

  @hasMany(() => PostComment, { foreignKey: 'post_id' })
  public comments: HasMany<typeof PostComment>

  @hasMany(() => Follow, { localKey: 'user_id', foreignKey: 'follower_user_id' })
  public follower: HasMany<typeof Follow>

  @hasMany(() => Follow, { localKey: 'user_id', foreignKey: 'followed_user_id' })
  public followed: HasMany<typeof Follow>


  public static reactionCount = scope((query: ModelQueryBuilderContract<typeof Post>, userId: number) =>
    query
      .preload('reactions', (builder) =>
        builder.distinct('emoji_type').where('user_id', userId).where('is_checked', true)
      )
      .withCount('reactions', (builder) =>
        builder.where('is_checked', true).where('emoji_type', 'like').as('like_count')
      )
      .withCount('reactions', (builder) =>
        builder.where('is_checked', true).where('emoji_type', 'favorite').as('favorite_count')
      )
  )

  public static commentCount = scope((query: ModelQueryBuilderContract<typeof Post>) =>
    query.withCount('comments', (builder) =>
      builder.where('is_deleted', false).as('comments_count')
    )
  )


  public static loadUser = scope((query: ModelQueryBuilderContract<typeof Post>) =>
    query.preload('user', (builder) => {
      builder.select(['id', 'first_name', 'last_name', 'username', 'email', 'profile_url', 'is_online'])
      .withCount('follower', (builder) =>
        builder.as('following_count')
      )
      .withCount('followed', (builder) =>
        builder.as('followers_count')
      )
    })
  )

  public static loadUserForAdmin = scope((query: ModelQueryBuilderContract<typeof Post>) =>
    query.preload('user', (builder) =>
      builder.select(['id', 'name', 'email', 'avatar', 'online', 'created_at'])
    )
  )

  public static loadContents = scope((query: ModelQueryBuilderContract<typeof Post>) =>
    query.preload('contents', (builder) => builder.orderBy('order', 'asc'))
  )

  public static loadAlreadyReact = scope(
    (query: ModelQueryBuilderContract<typeof Post>, userId: number) =>
      query.withAggregate('reactions', (builder) =>
        builder
          .max('emoji_type')
          .where('user_id', userId)
          .where('is_checked', true)
          .groupBy('id', 'user_id', 'post_id', 'emoji_type')
          .orderBy('id', 'desc')
          .limit(1)
          .as('already_reacted')
      )
  )

  public static filterByDate = scope(
    (query: ModelQueryBuilderContract<typeof Post>, startDate: DateTime, endDate: DateTime) =>
      query.andWhereBetween('created_at', [startDate.toString(), endDate.toString()])
  )

  public static filterByAdmin = scope((query: ModelQueryBuilderContract<typeof Post>) =>
    query.whereHas('user', (userQuery) => userQuery.where('admin', true))
  )

  public static onlyPublished = scope((query: ModelQueryBuilderContract<typeof Post>) =>
    query.andWhere('is_activated', true)
  )

  public static searchQueryScope = scope((query, search) => {
    const fields = ['text']
    let sql = ''

    fields.forEach(
      (field, i) => (sql = `${sql} ${i !== 0 ? ' or ' : ' '} ${field} ilike '%${search}%'`)
    )

    return query.where((builder) => {
      builder.whereRaw(`(${sql})`).orWhereNull('text')
    })
  })
  
  public static authorIdScope = scope((query, authorId) => {
    return query.where((builder) => {
      builder.where('user_id', '=', authorId);
    })
  })

  public static orderQueryScope = scope(
    (
      query: ModelQueryBuilderContract<typeof Post>,
      orders: Array<{ column: string; direction: any }>
    ) => {
      query.orderByRaw(`(case when posts.is_fixed = true then 1 else 2 end) asc`)

      for (const { column, direction } of orders) {
        query.orderBy(column, direction)
      }

      return query
    }
  )

  /**
   * ------------------------------------------------------
   * Misc
   * ------------------------------------------------------
   */
  public serializeExtras = true
}
