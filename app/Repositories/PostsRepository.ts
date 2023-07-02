import { injectable } from 'tsyringe';
import { IPost } from 'App/Interfaces/IPost'
import { IPostContent } from 'App/Interfaces/IPostContent'
import Post from 'App/Models/Post'
import PostContent from 'App/Models/PostContent'
import BaseRepository from 'App/Shared/Repositories/BaseRepository'

import MoreInteractedParams = IPost.DTO.MoreInteractedParams
import { ContextParams } from 'App/Shared/Interfaces/BaseInterface'

@injectable()
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

  public findBy(
    key: string,
    value: any,
    params?: ContextParams<typeof Post> | undefined
  ): Promise<Post | null> {
    return super.findBy(key, value, params)
  }
}
