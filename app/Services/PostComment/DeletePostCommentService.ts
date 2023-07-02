import { DateTime } from 'luxon'
import { inject, injectable } from 'tsyringe'

import { IPostComment } from 'App/Interfaces/IPostComment'
import NotFoundException from 'App/Shared/Exceptions/NotFoundException'

@injectable()
export class DeletePostCommentService {
  constructor(
    @inject('PostCommentRepository')
    private postCommentRepository: IPostComment.Repository
  ) {}

  public async run(commentId: number, userId: number): Promise<boolean> {
    const comment = await this.postCommentRepository.findBy('id', commentId)

    if (!comment || comment.user_id !== userId)
      throw new NotFoundException('Not found comment with this id or comment is not available.')
    comment.merge({
      is_deleted: true,
      deleted_at: DateTime.now(),
    })

    await this.postCommentRepository.update(comment)

    return true
  }
}
