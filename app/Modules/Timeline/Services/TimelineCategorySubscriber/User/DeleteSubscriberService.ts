import HttpContext from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'
import { inject, injectable } from 'tsyringe'

import { ITimelineCategorySubscriber } from 'App/Modules/Timeline/Interfaces/ITimelineCategorySubscriber'
import TimelineCategorySubscriber from 'App/Modules/Timeline/Models/TimelineCategorySubscriber'
import NotFoundException from 'App/Shared/Exceptions/NotFoundException'

@injectable()
export class DeleteSubscriberService {
  constructor(
    @inject('TimelineCategorySubscriptionsRepository')
    private subscriptionsRepository: ITimelineCategorySubscriber.Repository
  ) {}

  public async run(timelineCategoryId: number): Promise<TimelineCategorySubscriber> {
    const { i18n, currentUser: user } = HttpContext.get()!

    const subscription = await this.subscriptionsRepository.findBy(
      'timeline_category_id',
      timelineCategoryId,
      {
        clauses: { where: { user_id: user.id } },
      }
    )
    if (!subscription)
      throw new NotFoundException(
        i18n.formatMessage('messages.not_found', {
          model: i18n.formatMessage('models.subscription'),
        })
      )

    subscription.merge({
      is_deleted: true,
      deleted_at: DateTime.now(),
    })
    await this.subscriptionsRepository.save(subscription)

    return subscription
  }
}
