import { DateTime } from 'luxon'
import { inject, injectable } from 'tsyringe'

import { IPostComment } from 'App/Interfaces/IPostComment'
import NotFoundException from 'App/Shared/Exceptions/NotFoundException'
import AuthorizationException from 'App/Shared/Exceptions/AuthorizationException'

@injectable()
export class DeletePostCommentService {
  constructor(
    @inject('PostCommentRepository')
    private postCommentRepository: IPostComment.Repository
  ) {}

  public async run(commentId: number, userId: number): Promise<boolean> {
    const comment = await this.postCommentRepository.findByEager('id', commentId)

    if(!comment){
      throw new NotFoundException('Not found comment with this id or comment is not available.')
    }

    if (comment.user_id !== userId && comment.post?.user_id !== userId) { 
      throw new AuthorizationException('Not authorized to delete this comment')
    }
    
      comment.merge({
      is_deleted: true,
      deleted_at: DateTime.now(),
    })

    await this.postCommentRepository.update(comment)

    return true
  }
}
