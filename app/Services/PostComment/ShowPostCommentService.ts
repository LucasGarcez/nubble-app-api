import { inject, injectable } from 'tsyringe'

import NotFoundException from 'App/Shared/Exceptions/NotFoundException'

import { IPostComment } from '../../Interfaces/IPostComment'
import PostComment from '../../Models/PostComment'

@injectable()
export class ShowPostCommentService {
  constructor(
    @inject('PostCommentRepository')
    private postCommentRepository: IPostComment.Repository
  ) {}

  public async run(commentId: number): Promise<PostComment> {
    try {
      const comment = await this.postCommentRepository.show(commentId)

      if (!comment)
        throw new NotFoundException('Not found comment with this id or comment is not available.')

      return comment
    } catch (err) {
      throw new Error(err.message)
    }
  }
}
