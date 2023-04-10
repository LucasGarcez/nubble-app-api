import HttpContext from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'
import { inject, injectable } from 'tsyringe'

import { IPost } from 'App/Modules/Timeline/Interfaces/IPost'
import AppException from 'App/Shared/Exceptions/AppException'
import NotFoundException from 'App/Shared/Exceptions/NotFoundException'

@injectable()
export class DeletePostService {
  constructor(
    @inject('PostsRepository')
    private postsRepository: IPost.Repository
  ) {}

  public async execute(postId: number, userId: number): Promise<void> {
    const { i18n } = HttpContext.get()!

    const post = await this.postsRepository.findBy('id', postId)
    if (!post)
      throw new NotFoundException(
        i18n.formatMessage('messages.not_found', {
          model: i18n.formatMessage('models.post'),
        })
      )

    if (post.user_id !== userId) throw new AppException(i18n.formatMessage('messages.not_allow'))

    post.merge({
      is_deleted: true,
      deleted_at: DateTime.now(),
    })
    await this.postsRepository.save(post)
  }
}
