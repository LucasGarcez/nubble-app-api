import { inject, injectable } from 'tsyringe'

import { IRole } from 'App/Modules/Accounts/Interfaces/IRole'
import Role from 'App/Modules/Accounts/Models/Role'
import { PaginateContractType } from 'App/Shared/Interfaces/BaseInterface'

import { RolesDefault } from 'App/Modules/Accounts/Defaults'
import NotFoundException from 'App/Shared/Exceptions/NotFoundException'

import DTOs = IRole.DTOs

@injectable()
export default class RoleServices {
  constructor(
    @inject('RolesRepository')
    private rolesRepository: IRole.Repository
  ) {}

  public async list({
    page = 1,
    perPage = 10,
    search = '',
  }: DTOs.List): Promise<PaginateContractType<typeof Role>> {
    return this.rolesRepository.listWithPagination({
      page,
      perPage,
      scopes: (scopes) => {
        scopes.searchQueryScope(search)
        scopes.hideRoot()
      },
    })
  }

  public async getById(id: string): Promise<Role> {
    const role = await this.rolesRepository.findBy('id', id)
    if (!role) throw new NotFoundException('Role not found or not available.')
    return role
  }

  public async getByName(name: string): Promise<Role> {
    const role = await this.rolesRepository.findBy('name', name)
    if (!role) throw new NotFoundException('Role not found or not available.')
    return role
  }

  public async storeDefault(): Promise<void> {
    for (const role of RolesDefault)
      await this.rolesRepository.findOrStore({ name: role.name }, role)
  }
}
