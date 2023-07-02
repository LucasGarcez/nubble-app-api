import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

export default class Message extends BaseModel {
  public static table = 'messages'

  @column({ isPrimary: true })
  public id: number

  @column()
  public senderId: number

  @column()
  public recipientId: number

  @column()
  public message: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @belongsTo(() => User, { localKey: 'id', foreignKey: 'senderId' })
  public sender: BelongsTo<typeof User>

  @belongsTo(() => User, { localKey: 'id', foreignKey: 'recipientId' })
  public recipient: BelongsTo<typeof User>
}
