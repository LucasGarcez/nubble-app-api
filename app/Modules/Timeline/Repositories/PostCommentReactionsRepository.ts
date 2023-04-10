import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'

import { IPostCommentReaction } from '../Interfaces/IPostCommentReaction'
import PostCommentReaction from '../Models/PostCommentReaction'

export default class PostCommentReactionsRepository implements IPostCommentReaction.Repository {
  public async create(timelineDTO: IPostCommentReaction.DTO.Store): Promise<PostCommentReaction> {
    return PostCommentReaction.create(timelineDTO)
  }

  public async index(
    page: number,
    postCommentId: number,
    reactionType: string
  ): Promise<ModelPaginatorContract<PostCommentReaction>> {
    let baseQuery = PostCommentReaction.query()
      .withScopes((scopes) => {
        scopes.loadUser()
      })
      .where({
        post_comment_id: postCommentId,
      })

    if (reactionType) baseQuery = baseQuery.where('emoji_type', reactionType)

    return baseQuery.orderBy('id', 'desc').paginate(page)
  }

  public async show(timeline_category_id: string): Promise<PostCommentReaction | null> {
    return PostCommentReaction.findBy('id', timeline_category_id)
  }

  public async store(data: IPostCommentReaction.DTO.Store): Promise<PostCommentReaction> {
    return PostCommentReaction.create(data)
  }

  public async update(timeline_category: PostCommentReaction): Promise<PostCommentReaction> {
    return timeline_category.save()
  }

  /* ---------------------------- HELPERS ---------------------------- */

  public async findBy(findKey: string, findValue: string): Promise<PostCommentReaction | null> {
    return PostCommentReaction.findBy(findKey, findValue)
  }

  public async findOrCreate(
    searchPayload: IPostCommentReaction.DTO.Update,
    createPayload: IPostCommentReaction.DTO.Store
  ): Promise<PostCommentReaction | null> {
    return PostCommentReaction.firstOrCreate(searchPayload, createPayload)
  }

  public async deleteFromComment(commentId: number, userId: number): Promise<object> {
    return PostCommentReaction.query()
      .where({ post_comment_id: commentId, user_id: userId, is_deleted: false })
      .update({
        is_deleted: true,
      })
  }

  /* ---- SETTERS ---- */

  /* ---- GETTERS ---- */

  /* ---- CHECKERS  ----*/
}
