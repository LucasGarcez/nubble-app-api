import HttpContext from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'
import { inject, injectable } from 'tsyringe'

import { IPostComment } from 'App/Modules/Timeline/Interfaces/IPostComment'
import NotFoundException from 'App/Shared/Exceptions/NotFoundException'

@injectable()
export class DeletePostCommentService {
  constructor(
    @inject('PostCommentRepository')
    private postCommentRepository: IPostComment.Repository
  ) {}

  public async run(commentId: number, userId: number): Promise<boolean> {
    const { i18n } = HttpContext.get()!

    const comment = await this.postCommentRepository.findBy('id', commentId)

    if (!comment || comment.user_id !== userId)
      throw new NotFoundException(
        i18n.formatMessage('messages.not_found', {
          model: i18n.formatMessage('models.comment'),
        })
      )
    comment.merge({
      is_deleted: true,
      deleted_at: DateTime.now(),
    })

    await this.postCommentRepository.update(comment)

    return true
  }
}
