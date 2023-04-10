import HttpContext from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'
import { inject, injectable } from 'tsyringe'

import { ITimelineCategory } from 'App/Modules/Timeline/Interfaces/ITimelineCategory'
import TimelineCategory from 'App/Modules/Timeline/Models/TimelineCategory'
import AppException from 'App/Shared/Exceptions/AppException'
import NotFoundException from 'App/Shared/Exceptions/NotFoundException'

@injectable()
export class DeleteTimelineCategoryService {
  constructor(
    @inject('TimelineCategoriesRepository')
    private timelineCategoriesRepository: ITimelineCategory.Repository
  ) {}

  public async run(timelineId: number): Promise<TimelineCategory> {
    const ctx = HttpContext.get()!

    const timeline = await this.timelineCategoriesRepository.findBy('id', timelineId)
    if (!timeline)
      throw new NotFoundException(
        ctx.i18n.formatMessage('messages.not_found', {
          model: ctx.i18n.formatMessage('models.timeline_category'),
        })
      )

    if (timeline.is_default)
      throw new AppException(ctx.i18n.formatMessage('messages.cannot_delete_default_timeline'))

    timeline.merge({
      is_deleted: true,
      deleted_at: DateTime.now(),
    })
    await this.timelineCategoriesRepository.save(timeline)

    return timeline
  }
}
