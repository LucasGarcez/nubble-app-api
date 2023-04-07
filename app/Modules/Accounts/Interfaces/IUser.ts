import BaseInterface from 'App/Shared/Interfaces/BaseInterface'
import User from 'App/Modules/Accounts/Models/User'

export namespace IUser {
  export interface Repository extends BaseInterface<typeof User>, Helpers {}

  export interface Helpers {}

  export namespace DTOs {
    export type List = {
      page: number
      perPage: number
      search: string
    }

    export type Store = {
      first_name: string
      last_name: string
      username: string
      email: string
    }

    export type Edit = {
      first_name?: string
      last_name?: string
      username?: string
      email?: string
    }
  }
}
