import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import { inject, injectable } from 'tsyringe'

import { IPostComment } from '../../Interfaces/IPostComment'
import PostComment from '../../Models/PostComment'

@injectable()
export class IndexPostCommentService {
  constructor(
    @inject('PostCommentRepository')
    private postCommentRepository: IPostComment.Repository
  ) {}

  public async run(
    page: number,
    postId: number | null,
    // postCommentId: number | null,
    userId: number,
    perPage: number
  ): Promise<ModelPaginatorContract<PostComment>> {
    try {
      const comments = await this.postCommentRepository.index(
        page,
        postId,
        // postCommentId,
        userId,
        perPage
      )

      return comments
    } catch (err) {
      throw new Error(err.message)
    }
  }
}
