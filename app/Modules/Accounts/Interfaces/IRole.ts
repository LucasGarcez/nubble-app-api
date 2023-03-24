import BaseInterface from 'App/Shared/Interfaces/BaseInterface'
import Role from 'App/Modules/Accounts/Models/Role'

export namespace IRole {
  export interface Repository extends BaseInterface<typeof Role>, Helpers {}

  export interface Helpers {}

  export namespace DTOs {
    export type List = {
      page: number
      perPage: number
      search: string
    }
  }
}
