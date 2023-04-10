import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'

import PostCommentReaction from 'App/Modules/Timeline/Models/PostCommentReaction'

export namespace IPostCommentReaction {
  export interface Repository extends Helpers {
    create(timelineDTO: IPostCommentReaction.DTO.Store): Promise<PostCommentReaction>

    index(
      page: number,
      postCommentId: number,
      reactionType: string
    ): Promise<ModelPaginatorContract<PostCommentReaction>>
  }

  export interface Helpers {
    findBy(indKey: string, findValue: string): Promise<PostCommentReaction | null>

    findOrCreate(
      searchPayload: IPostCommentReaction.DTO.Update,
      createPayload: IPostCommentReaction.DTO.Store
    ): Promise<PostCommentReaction | null>

    deleteFromComment(commentId: number, userId: number): Promise<object>
  }

  export namespace DTO {
    export interface Store {
      emoji_type: string
      user_id: number
      post_comment_id: number
      hub_event_id?: number
    }

    export interface Update {
      emoji_type?: string
      user_id?: number
      post_comment_id?: number
      hub_event_id?: number
    }
  }
}
