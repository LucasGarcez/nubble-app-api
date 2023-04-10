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
    const { i18n, currentUser: user } = HttpContext.get()!

    const groupIds = (await user.related('groups').query().select(['id'])).map((item) => item['id'])
    const timeline = await this.timelineCategoriesRepository.findBy('id', timelineId, {
      scopes: (scopes) => {
        scopes.loadPermission(groupIds)
        scopes.loadSubcribe(user.id)
        scopes.loadAlreadyReact(user.id)
        scopes.filterVisibility(groupIds)
      },
    })
    if (!timeline)
      throw new NotFoundException(
        i18n.formatMessage('messages.not_found', {
          model: i18n.formatMessage('models.timeline_category'),
        })
      )

    return timeline
  }
}
