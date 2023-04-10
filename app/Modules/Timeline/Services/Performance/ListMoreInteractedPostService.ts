import HttpContext from '@ioc:Adonis/Core/HttpContext'
import { inject, injectable } from 'tsyringe'

import { IPost } from 'App/Modules/Timeline/Interfaces/IPost'
import { ITimelineCategory } from 'App/Modules/Timeline/Interfaces/ITimelineCategory'
import Post from 'App/Modules/Timeline/Models/Post'
import NotFoundException from 'App/Shared/Exceptions/NotFoundException'
import MoreInteractedParams = IPost.DTO.MoreInteractedParams

@injectable()
export class ListMoreInteractedPostService {
  constructor(
    @inject('PostsRepository')
    private postRepository: IPost.Repository,
    @inject('TimelineCategoriesRepository')
    private timelineCategoriesRepository: ITimelineCategory.Repository
  ) {}

  public async run({ startDate, endDate, timelineId }: MoreInteractedParams): Promise<Array<Post>> {
    const { i18n } = HttpContext.get()!

    const timeline = await this.timelineCategoriesRepository.findBy('id', timelineId)
    if (!timeline)
      throw new NotFoundException(
        i18n.formatMessage('messages.not_found', {
          model: i18n.formatMessage('models.timeline_category'),
        })
      )

    return this.postRepository.getMoreInteractedPosts({
      startDate,
      endDate,
      timelineId,
    })
  }
}
