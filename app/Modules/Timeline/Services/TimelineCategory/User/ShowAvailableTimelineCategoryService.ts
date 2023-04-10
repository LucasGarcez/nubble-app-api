import HttpContext from '@ioc:Adonis/Core/HttpContext'
import { inject, injectable } from 'tsyringe'

import { ITimelineCategory } from 'App/Modules/Timeline/Interfaces/ITimelineCategory'
import TimelineCategory from 'App/Modules/Timeline/Models/TimelineCategory'
import NotFoundException from 'App/Shared/Exceptions/NotFoundException'

@injectable()
export class ShowAvailableTimelineCategoryService {
  constructor(
    @inject('TimelineCategoriesRepository')
    private timelineCategoriesRepository: ITimelineCategory.Repository
  ) {}

  public async run(timelineId: number): Promise<TimelineCategory> {
    const { i18n, currentUser: user } = HttpContext.get()!

    const groupIds = (await user.related('groups').query().select(['id'])).map((item) => item['id'])
    const timeline = await this.timelineCategoriesRepository.findAvailable(
      timelineId,
      user.id,
      groupIds
    )
    if (!timeline)
      throw new NotFoundException(
        i18n.formatMessage('messages.not_found', {
          model: i18n.formatMessage('models.timeline_category'),
        })
      )

    return timeline
  }
}
