import HttpContext from '@ioc:Adonis/Core/HttpContext'
import { inject, injectable } from 'tsyringe'

import NotFoundException from 'App/Shared/Exceptions/NotFoundException'

import AppException from '../../../../../Shared/Exceptions/AppException'
import { IPostComment } from '../../../Interfaces/IPostComment'
import PostComment from '../../../Models/PostComment'

@injectable()
export class ShowPostCommentService {
  constructor(
    @inject('PostCommentRepository')
    private postCommentRepository: IPostComment.Repository
  ) {}

  public async run(commentId: number, userId: number): Promise<PostComment> {
    const ctx = HttpContext.get()!

    try {
      const comment = await this.postCommentRepository.show(commentId, userId)

      if (!comment)
        throw new NotFoundException(
          ctx.i18n.formatMessage('messages.not_found', {
            model: ctx.i18n.formatMessage('models.comment'),
          })
        )

      return comment
    } catch (err) {
      throw new AppException(err.message)
    }
  }
}
