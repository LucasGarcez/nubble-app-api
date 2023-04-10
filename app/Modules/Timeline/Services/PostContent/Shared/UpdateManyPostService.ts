import HttpContext from '@ioc:Adonis/Core/HttpContext'
import { inject, injectable } from 'tsyringe'

import { IPostContent } from 'App/Modules/Timeline/Interfaces/IPostContent'
import AppException from 'App/Shared/Exceptions/AppException'

import DTO = IPostContent.DTO

@injectable()
export class UpdateManyPostService {
  constructor(
    @inject('PostContentRepository')
    private postContentRepository: IPostContent.Repository
  ) {}

  public async run(contentsDto: DTO.Update[]): Promise<void> {
    const { i18n } = HttpContext.get()!

    for await (const contentDto of contentsDto) {
      if (contentDto.id) {
        const content = await this.postContentRepository.findBy('id', contentDto.id)
        if (!content || content.post_id !== contentDto.post_id)
          throw new AppException(
            i18n.formatMessage('messages.error_while_trying_to_save_post_contents')
          )

        content.merge(contentDto)

        await this.postContentRepository.update(content)
      }
    }
  }
}
