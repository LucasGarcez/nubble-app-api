import { injectable, inject } from 'tsyringe'
import { DateTime } from 'luxon'
import crypto from 'crypto'

import { IRole } from 'App/Modules/Accounts/Interfaces/IRole'
import { IUser } from 'App/Modules/Accounts/Interfaces/IUser'
import User from 'App/Modules/Accounts/Models/User'
import { PaginateContractType } from 'App/Shared/Interfaces/BaseInterface'

import NotFoundException from 'App/Shared/Exceptions/NotFoundException'
import BadRequestException from 'App/Shared/Exceptions/BadRequestException'

import { UsersDefault } from 'App/Modules/Accounts/Defaults'
import DTOs = IUser.DTOs

@injectable()
export default class UserServices {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUser.Repository,
    @inject('RolesRepository')
    private rolesRepository: IRole.Repository
  ) {}

  public async list({
    page = 1,
    perPage = 10,
    search,
  }: DTOs.List): Promise<PaginateContractType<typeof User>> {
    return this.usersRepository.listWithPagination({
      page,
      perPage,
      scopes: (scopes) => {
        scopes.searchQueryScope(search)
        scopes.hideRoot()
      },
    })
  }

  public async get(id: string): Promise<User> {
    const user = await this.usersRepository.findBy('id', id)
    if (!user) throw new NotFoundException('User not found or not available.')
    return user
  }

  public async store(data: DTOs.Store): Promise<User> {
    const { roles, ...userDto } = data
    if (!roles) throw new BadRequestException('Role is required.')

    const user = await this.usersRepository.store(userDto)
    user.related('roles').attach(roles)

    return user.refresh()
  }

  public async edit(id: string, data: DTOs.Edit): Promise<User> {
    const user = await this.usersRepository.findBy('id', id)
    if (!user) throw new NotFoundException('User not found or not available.')
    if (user.isRole('root') || user.isRole('admin'))
      throw new BadRequestException('Can not edit this user.')

    const { roles, ...userDto } = data

    user.merge(userDto)
    await this.usersRepository.save(user)
    if (roles && roles.length > 0) user.related('roles').sync(roles)

    return user.refresh()
  }

  public async delete(id: string): Promise<void> {
    const user = await this.usersRepository.findBy('id', id)
    if (!user) throw new NotFoundException('User not found or not available.')
    if (user.isRole('root') || user.isRole('admin'))
      throw new BadRequestException('Can not delete this user.')

    user.merge({
      email: `deleted:${user.email}:${crypto.randomBytes(6).toString('hex')}`,
      username: `deleted:${user.username}:${crypto.randomBytes(6).toString('hex')}`,
      is_deleted: true,
      deleted_at: DateTime.now(),
    })
    await this.usersRepository.save(user)
  }

  public async storeDefault(): Promise<void> {
    for (const data of UsersDefault) {
      const { roleName, ...userDto } = data
      const user = await this.usersRepository.findOrStore({ username: userDto.username }, userDto)
      const role = await this.rolesRepository.pluckBy('id', {
        like: { column: 'name', match: roleName },
      })
      await user.related('roles').attach(role)
    }
  }
}
