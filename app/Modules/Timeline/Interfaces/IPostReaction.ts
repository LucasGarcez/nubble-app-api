import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'

import PostReaction from 'App/Modules/Timeline/Models/PostReaction'

export namespace IPostReaction {
  export interface Repository extends Helpers {
    create(timelineDTO: IPostReaction.DTO.Store): Promise<PostReaction>

    index(
      page: number,
      postId: number,
      reactionType: string
    ): Promise<ModelPaginatorContract<PostReaction>>
  }

  export interface Helpers {
    findBy(indKey: string, findValue: string): Promise<PostReaction | null>

    findOrCreate(
      searchPayload: IPostReaction.DTO.Update,
      createPayload: IPostReaction.DTO.Store
    ): Promise<PostReaction | null>

    deleteFromPost(postId: number, userId: number): Promise<object>

    getReactionCountBetweenDate(startDate: Date | string, endDate: Date | string): Promise<number>

    getUserCountByPost(postId: number): Promise<number>

    getLastByPost(postId: number): Promise<PostReaction | null>
  }

  export enum emojiTypes {
    thumbsup = ':thumbsup:',
  }

  export namespace DTO {
    export interface Store {
      emoji_type: string
      user_id: number
      post_id: number
      hub_event_id?: number
    }

    export interface Update {
      emoji_type?: string
      user_id?: number
      post_id?: number
      hub_event_id?: number
    }
  }
}
