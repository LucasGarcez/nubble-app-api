import HttpContext from '@ioc:Adonis/Core/HttpContext'
import { inject, injectable } from 'tsyringe'

import { ITimelineCategory } from 'App/Modules/Timeline/Interfaces/ITimelineCategory'
import TimelineCategory from 'App/Modules/Timeline/Models/TimelineCategory'
import NotFoundException from 'App/Shared/Exceptions/NotFoundException'
import DTO = ITimelineCategory.DTO

@injectable()
export class UpdateTimelineCategoryService {
  constructor(
    @inject('TimelineCategoriesRepository')
    private timelineCategoriesRepository: ITimelineCategory.Repository
  ) {}

  public async run(
    timelineId: number,
    data: DTO.Update,
    groupIds: Array<number>
  ): Promise<TimelineCategory> {
    const ctx = HttpContext.get()!

    const timeline = await this.timelineCategoriesRepository.findBy('id', timelineId)
    if (!timeline)
      throw new NotFoundException(
        ctx.i18n.formatMessage('messages.not_found', {
          model: ctx.i18n.formatMessage('models.timeline_category'),
        })
      )

    timeline.merge(data)
    await this.timelineCategoriesRepository.save(timeline)
    await timeline.related('groups').sync(groupIds)

    return timeline
  }
}
