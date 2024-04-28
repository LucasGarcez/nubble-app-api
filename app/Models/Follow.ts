import { DateTime } from 'luxon'
import { BelongsTo, ModelQueryBuilderContract, belongsTo, column, scope } from '@ioc:Adonis/Lucid/Orm'
import BaseModel from 'App/Shared/Models/BaseModel'
import User from 'App/Models/User'

export default class Follow extends BaseModel {
  public static table = 'follows'

  @column({ isPrimary: true })
  public id: number

  @column()
  public follower_user_id: number

  @column()
  public followed_user_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'follower_user_id' })
  public follower: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'followed_user_id' })
  public followed: BelongsTo<typeof User>

  /**
   * ------------------------------------------------------
   * Scopes
   * ------------------------------------------------------
   */
  public static loadFollower = scope((query: ModelQueryBuilderContract<typeof Follow>, userId: number) =>
    query.select(['id', 'followed_user_id'])
    .where('follower_user_id', userId)
    .preload('followed', (builder) => {
      builder.select(['id', 'first_name', 'last_name', 'username', 'email', 'profile_url', 'is_online'])
    })
  )

  public static loadFollowed = scope((query: ModelQueryBuilderContract<typeof Follow>, userId: number) =>
    query.select(['id', 'follower_user_id'])
    .where('followed_user_id', userId)
    .preload('follower', (builder) => {
      builder.select(['id', 'first_name', 'last_name', 'username', 'email', 'profile_url', 'is_online'])
    })
  )

  /**
   * ------------------------------------------------------
   * Misc
   * ------------------------------------------------------
   */
  public serializeExtras = true
}
