import HttpContext from '@ioc:Adonis/Core/HttpContext'
import { inject, injectable } from 'tsyringe'

import NotFoundException from 'App/Shared/Exceptions/NotFoundException'

import AppException from '../../../../../Shared/Exceptions/AppException'
import { IPostComment } from '../../../Interfaces/IPostComment'
import PostComment from '../../../Models/PostComment'

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
    const ctx = HttpContext.get()!

    try {
      const comment = await this.postCommentRepository.findBy('id', commentId)

      if (!comment || comment.user_id !== userId)
        throw new NotFoundException(
          ctx.i18n.formatMessage('messages.not_found', {
            model: ctx.i18n.formatMessage('models.comment'),
          })
        )

      comment.merge(commentData)
      await this.postCommentRepository.update(comment)

      return comment
    } catch (err) {
      throw new AppException(err.message)
    }
  }
}
