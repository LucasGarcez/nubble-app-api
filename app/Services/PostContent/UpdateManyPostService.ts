import { inject, injectable } from 'tsyringe'

import { IPostContent } from 'App/Interfaces/IPostContent'

import DTO = IPostContent.DTO

@injectable()
export class UpdateManyPostService {
  constructor(
    @inject('PostContentRepository')
    private postContentRepository: IPostContent.Repository
  ) {}

  public async run(contentsDto: DTO.Update[]): Promise<void> {
    for await (const contentDto of contentsDto) {
      if (contentDto.id) {
        const content = await this.postContentRepository.findBy('id', contentDto.id)
        if (!content || content.post_id !== contentDto.post_id)
          throw new Error('Not found content with this id or content is not available.')

        content.merge(contentDto)

        await this.postContentRepository.update(content)
      }
    }
  }
}
