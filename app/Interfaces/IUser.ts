import BaseInterface from 'App/Shared/Interfaces/BaseInterface'
import User from 'App/Models/User'

export namespace IUser {
  export interface Repository extends BaseInterface<typeof User>, Helpers { }

  export interface Helpers { }

  export namespace DTOs {
    export type List = {
      page: number
      perPage: number
      search: string
    }

    export type Store = {
      firstName: string
      lastName: string
      username: string
      email: string
      password?: string
    }

    export type Edit = {
      firstName?: string
      lastName?: string
      username?: string
      email?: string
    }

    export type Login = {
      email: string
      password: string
    }

    export type ForgotPassword = {
      email: string
    }
  }
}
