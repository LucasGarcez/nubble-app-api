import HttpContext from '@ioc:Adonis/Core/HttpContext'
import { inject, injectable } from 'tsyringe'

import { IPost } from 'App/Modules/Timeline/Interfaces/IPost'
import { ITimelineCategory } from 'App/Modules/Timeline/Interfaces/ITimelineCategory'
import { ITimelineCategorySubscriber } from 'App/Modules/Timeline/Interfaces/ITimelineCategorySubscriber'
import NotFoundException from 'App/Shared/Exceptions/NotFoundException'

import ChartParams = ITimelineCategorySubscriber.DTO.ChartParams
import ChartReturn = ITimelineCategorySubscriber.DTO.ChartReturn

@injectable()
export class ChartPostsTimelineService {
  constructor(
    @inject('PostsRepository')
    private postsRepository: IPost.Repository,
    @inject('TimelineCategoriesRepository')
    private timelineCategoriesRepository: ITimelineCategory.Repository
  ) {}

  public async run({
    startDate,
    endDate,
    granularity,
    timelineId,
  }: ChartParams): Promise<ChartReturn> {
    const { i18n } = HttpContext.get()!

    const timeline = await this.timelineCategoriesRepository.findBy('id', timelineId)
    if (!timeline)
      throw new NotFoundException(
        i18n.formatMessage('messages.not_found', {
          model: i18n.formatMessage('models.timeline_category'),
        })
      )

    return this.postsRepository.chartPosts({ startDate, endDate, granularity, timelineId })
  }
}