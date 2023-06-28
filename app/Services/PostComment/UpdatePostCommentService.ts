import { inject, injectable } from 'tsyringe'

import NotFoundException from 'App/Shared/Exceptions/NotFoundException'

import { IPostComment } from '../../Interfaces/IPostComment'
import PostComment from '../../Models/PostComment'

@injectable()
export class UpdatePostCommentService {
  constructor(
    @inject('PostCommentRepository')
    private postCommentRepository: IPostComment.Repository
  ) {}

  public async run(
    commentData: IPostComment.DTO.Update,
    commentId: number,
    userId: number
  ): Promise<PostComment> {
    try {
      const comment = await this.postCommentRepository.findBy('id', commentId)

      if (!comment || comment.user_id !== userId)
        throw new NotFoundException('Not found comment with this id or comment is not available.')

      comment.merge(commentData)
      await this.postCommentRepository.update(comment)

      return comment
    } catch (err) {
      throw new Error(err.message)
    }
  }
}
