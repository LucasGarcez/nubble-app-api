import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  computed,
  manyToMany,
  ManyToMany,
  scope,
  afterFind,
  afterFetch,
  afterPaginate,
  ModelQueryBuilderContract,
  beforeCreate,
} from '@ioc:Adonis/Lucid/Orm'
import { container } from 'tsyringe'

import BaseModel from 'App/Shared/Models/BaseModel'
import Role from 'App/Modules/Accounts/Models/Role'
import { RoleServices } from 'App/Modules/Accounts/Services/Admin'

export default class User extends BaseModel {
  public static table = 'users'

  /**
   * ------------------------------------------------------
   * Columns
   * ------------------------------------------------------
   * - column typing struct
   */
  @column({ isPrimary: true })
  public id: string

  @computed()
  public get full_name() {
    return `${this.first_name} ${this.last_name}`
  }

  @column()
  public first_name: string

  @column()
  public last_name: string

  @column()
  public username: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public remember_me_token?: string

  @column()
  public is_online: boolean

  @column({ serializeAs: null })
  public is_blocked: boolean

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
  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) user.password = await Hash.make(user.password)
  }

  @afterFind()
  public static async loadRolesOnGet(user: User): Promise<void> {
    await user.load('roles', (builder) => builder.orderBy('slug'))
  }

  @afterFetch()
  @afterPaginate()
  public static async loadRolesOnPaginate(users: Array<User>): Promise<void> {
    for (const user of users) await user.load('roles', (builder) => builder.orderBy('slug'))
  }

  @beforeCreate()
  public static async attachUserName(user: User): Promise<void> {
    if (!user.username) {
      user.username = user.email.split('@')[0]
      for (let i = 0; ; i++) {
        if (!(await User.query().where('username', user.username).first()))
          user.username = `${user.username}${i}`
        else break
      }
    }
  }

  /**
   * ------------------------------------------------------
   * Relationships
   * ------------------------------------------------------
   * - define User model relationships
   */
  @manyToMany(() => Role, {
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'role_id',
    pivotTable: 'users_roles',
  })
  public roles: ManyToMany<typeof Role>

  /**
   * ------------------------------------------------------
   * Query Scopes
   * ------------------------------------------------------
   */
  public static searchQueryScope = scope((query, search) => {
    const fields = ['first_name', 'last_name', 'username', 'email']
    let sql = ''

    fields.forEach(
      (field, i) => (sql = `${sql} ${i !== 0 ? ' or ' : ' '} ${field} ilike '%${search}%'`)
    )

    return query.whereRaw(`(${sql})`)
  })

  public static hideRoot = scope((query: ModelQueryBuilderContract<typeof Role>) =>
    query.andWhereNot('username', 'root')
  )

  /**
   * ------------------------------------------------------
   * Misc
   * ------------------------------------------------------
   */
  public isRole(name: string): boolean {
    return !!this.roles.find((role) => role.name === name)
  }

  public async attachRoleByName(this, name: string): Promise<void> {
    const roleServices = container.resolve(RoleServices)
    const { id: roleId } = await roleServices.getByName(name)
    await this.related('roles').attach([roleId])
  }
}
