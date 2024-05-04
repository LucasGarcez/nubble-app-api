import BaseInterface from 'App/Shared/Interfaces/BaseInterface'
import Follow from 'App/Models/Follow'

export namespace IFollow {
  export interface Repository extends BaseInterface<typeof Follow>, Helpers {
    isFallowed(follower_user_id: number, followed_user_id: number): Promise<boolean>
  }

  export interface Helpers { }

  export namespace DTOs {
    export type Store = {
      follower_user_id: number
      followed_user_id: number
    }

    export type Delete = {
      id: number
      follower_user_id: number
    }

    export type ListFollower = {
      page: number
      perPage: number
      userId: number
    }

    export type ListFollowed = {
      page: number
      perPage: number
      userId: number
    }
  }
}
