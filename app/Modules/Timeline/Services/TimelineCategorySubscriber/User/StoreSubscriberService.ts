import HttpContext from '@ioc:Adonis/Core/HttpContext'
import { inject, injectable } from 'tsyringe'

import { ITimelineCategory } from 'App/Modules/Timeline/Interfaces/ITimelineCategory'
import { ITimelineCategorySubscriber } from 'App/Modules/Timeline/Interfaces/ITimelineCategorySubscriber'
import TimelineCategorySubscriber from 'App/Modules/Timeline/Models/TimelineCategorySubscriber'
import NotFoundException from 'App/Shared/Exceptions/NotFoundException'

import DTO = ITimelineCategorySubscriber.DTO

@injectable()
export class StoreSubscriberService {
  constructor(
    @inject('TimelineCategorySubscriptionsRepository')
    private subscriptionsRepository: ITimelineCategorySubscriber.Repository,
    @inject('TimelineCategoriesRepository')
    private timelineRepository: ITimelineCategory.Repository
  ) {}

  public async run(data: DTO.Store): Promise<TimelineCategorySubscriber> {
    const { i18n } = HttpContext.get()!

    const timelineCategory = await this.timelineRepository.findBy('id', data.timeline_category_id)
    if (!timelineCategory)
      throw new NotFoundException(
        i18n.formatMessage('messages.not_found', {
          model: i18n.formatMessage('models.timeline_category'),
        })
      )

    if (!timelineCategory.allow_subscriber)
      throw new NotFoundException(i18n.formatMessage('messages.not_allow'))

    return this.subscriptionsRepository.store(data).then((subscription) => subscription.refresh())
  }
}
