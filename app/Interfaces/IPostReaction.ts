import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'

import PostReaction from 'App/Models/PostReaction'

export namespace IPostReaction {
  export interface Repository extends Helpers {

    index(
      page: number,
      perPage: number,
      postId: number,
      reactionType: string
    ): Promise<ModelPaginatorContract<PostReaction>>

  }

  export interface Helpers {

    store(data: IPostReaction.DTO.Store): Promise<PostReaction>

    update(data: PostReaction): Promise<PostReaction>

    exists(data: IPostReaction.DTO.Show): Promise<PostReaction | null>

    findBy(indKey: string, findValue: string): Promise<PostReaction | null>

    deleteFromPost(postId: number, userId: number, emojiType: string): Promise<object>

    getReactionCountBetweenDate(startDate: Date | string, endDate: Date | string): Promise<number>

    getUserCountByPost(postId: number): Promise<number>

    getLastByPost(postId: number): Promise<PostReaction | null>
  }

  export namespace DTO {
    export interface Store {
      emoji_type: string
      user_id: number
      post_id: number
      is_checked?: boolean
    }

    export interface Update {
      emoji_type: string
      user_id: number
      post_id: number
      is_checked: boolean
    }

    export interface Show {
      emoji_type: string
      user_id: number
      post_id: number
      is_checked?: boolean
    }
  }
}
