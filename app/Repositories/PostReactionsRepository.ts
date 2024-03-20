import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'

import { IPostReaction } from 'App/Interfaces/IPostReaction'
import PostReaction from 'App/Models/PostReaction'

export default class PostsRepository implements IPostReaction.Repository {
  public async index(
    page: number,
    perPage: number,
    postId: number,
    reactionType: string
  ): Promise<ModelPaginatorContract<PostReaction>> {
    let baseQuery = PostReaction.query()
      .withScopes((scopes) => {
        scopes.loadUser()
      })
      .where({
        post_id: postId,
      })

    if (reactionType) baseQuery = baseQuery.where('emoji_type', reactionType)

    return baseQuery.orderBy('id', 'desc').paginate(page, perPage)
  }

  public async show(timeline_category_id: string): Promise<PostReaction | null> {
    return PostReaction.findBy('id', timeline_category_id)
  }

  public async store(data: IPostReaction.DTO.Store): Promise<PostReaction> {
    return PostReaction.create(data)
  }

  public async update(data: PostReaction): Promise<PostReaction> {
    return data.save()
  }

  public async exists(data: IPostReaction.DTO.Show): Promise<PostReaction | null> {
    let baseQuery = PostReaction.query()
      .where({
        post_id: data.post_id,
        user_id: data.user_id,
        emoji_type: data.emoji_type
      })

    return baseQuery.first()
  }

  /* ---------------------------- HELPERS ---------------------------- */

  public async findBy(findKey: string, findValue: string): Promise<PostReaction | null> {
    return PostReaction.findBy(findKey, findValue)
  }

  public async deleteFromPost(postId: number, userId: number, emojiType: string): Promise<object> {
    return PostReaction.query()
      .where({ post_id: postId, user_id: userId, emoji_type: emojiType})
      .delete()
  }

  public async getReactionCountBetweenDate(
    startDate: Date | string,
    endDate: Date | string
  ): Promise<number> {
    const reactionCount = await PostReaction.query()
      .whereBetween('created_at', [startDate, endDate])
      .count('*')

    return Number(reactionCount[0].$extras.count)
  }

  public async getUserCountByPost(postId: number): Promise<number> {
    const reactionCount = await PostReaction.query()
      .where({
        post_id: postId,
      })
      .countDistinct('user_id')

    return Number(reactionCount[0].$extras.count)
  }

  public async getLastByPost(postId: number): Promise<PostReaction | null> {
    return PostReaction.query().where({ post_id: postId }).orderBy('created_at', 'desc').first()
  }

  /* ---- SETTERS ---- */

  /* ---- GETTERS ---- */

  /* ---- CHECKERS  ----*/
}
