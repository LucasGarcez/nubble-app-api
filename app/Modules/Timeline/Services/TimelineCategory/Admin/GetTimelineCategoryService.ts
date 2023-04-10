import HttpContext from '@ioc:Adonis/Core/HttpContext'
import { inject, injectable } from 'tsyringe'

import { ITimelineCategory } from 'App/Modules/Timeline/Interfaces/ITimelineCategory'
import TimelineCategory from 'App/Modules/Timeline/Models/TimelineCategory'
import NotFoundException from 'App/Shared/Exceptions/NotFoundException'

@injectable()
export class GetTimelineCategoryService {
  constructor(
    @inject('TimelineCategoriesRepository')
    private timelineCategoriesRepository: ITimelineCategory.Repository
  ) {}

  public async run(timelineId: number): Promise<TimelineCategory> {
    const ctx = HttpContext.get()!

    const timeline = await this.timelineCategoriesRepository.findBy('id', timelineId, {
      scopes: (scope) => scope.loadGroups(),
    })

    if (!timeline)
      throw new NotFoundException(
        ctx.i18n.formatMessage('messages.not_found', {
          model: ctx.i18n.formatMessage('models.timeline_category'),
        })
      )

    return timeline
  }
}
