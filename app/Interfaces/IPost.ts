import BaseInterface from 'App/Shared/Interfaces/BaseInterface'
import Post from 'App/Models/Post'

export namespace IPost {
  export interface Repository extends BaseInterface<typeof Post>, Helpers {}

  export interface Helpers {}

  export namespace DTOs {
    export type List = {
      page: number
      perPage: number
      search: string
    }

    export type Store = {
      content_url: string
      text: string
    }

    export type Edit = {
      content_url?: string
      text?: string
    }
  }
}
