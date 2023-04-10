import Database from '@ioc:Adonis/Lucid/Database'

import { IPost } from 'App/Modules/Timeline/Interfaces/IPost'
import { IPostContent } from 'App/Modules/Timeline/Interfaces/IPostContent'
import Post from 'App/Modules/Timeline/Models/Post'
import PostContent from 'App/Modules/Timeline/Models/PostContent'
import BaseRepository from 'App/Shared/Repositories/BaseRepository'

import MoreInteractedParams = IPost.DTO.MoreInteractedParams

export default class PostsRepository
  extends BaseRepository<typeof Post>
  implements IPost.Repository {
  constructor() {
    super(Post)
  }

  public async createManyContents(
    contents: Array<IPostContent.DTO.Store>,
    post: Post
  ): Promise<PostContent[] | null> {
    return post.related('contents').createMany(contents)
  }

  public async getMoreInteractedPosts({
    startDate,
    endDate,
  }: MoreInteractedParams): Promise<Array<Post>> {
    const query = this.orm
      .query()
      .select('id', 'text')
      .andWhereBetween('created_at', [startDate.toString(), endDate.toString()])
      .withCount('comments', (builder) =>
        builder.where('is_deleted', false).as('post_comments_count')
      )
      .withCount('reactions', (builder) =>
        builder.where('is_deleted', false).as('post_reactions_count')
      )
      .orderBy('post_comments_count', 'desc')
      .orderBy('post_reactions_count', 'desc')

    const posts = await query.limit(3)

    return posts
  }

  public async getPostCountBetweenDate(
    startDate: Date | string,
    endDate: Date | string
  ): Promise<number> {
    const postCount = await this.orm
      .query()
      .whereBetween('created_at', [startDate, endDate])
      .count('*')

    return Number(postCount[0].$extras.count)
  }
}
