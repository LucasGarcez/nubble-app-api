import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'

import PostComment from 'App/Models/PostComment'

export namespace IPostComment {
  export interface Repository extends Helpers {
    create(timelineDTO: IPostComment.DTO.Store): Promise<PostComment>

    index(
      page: number,
      postId: number | null,
      perPage: number
    ): Promise<ModelPaginatorContract<PostComment>>

    show(postCommentId: number, userId: number): Promise<PostComment | null>
  }

  export interface Helpers {
    findBy(indKey: string, findValue: any): Promise<PostComment | null>
    findByEager(indKey: string, findValue: any): Promise<PostComment | null>

    findOrCreate(
      searchPayload: IPostComment.DTO.Update,
      createPayload: IPostComment.DTO.Store
    ): Promise<PostComment | null>

    update(postComment: PostComment): Promise<PostComment>

    getCommentCountBetweenDate(startDate: Date | string, endDate: Date | string): Promise<number>

    getUserCountByPost(postId: number): Promise<number>

    getLastByPost(postId: number): Promise<PostComment | null>
  }

  export namespace DTO {
    export interface Store {
      message: string
      user_id: number
      post_id: number
      reply_comment_id?: number
      hub_event_id?: number
    }

    export interface Update {
      message?: string
      user_id?: number
      post_id?: number
      reply_comment_id?: number
      hub_event_id?: number
    }
  }
}
