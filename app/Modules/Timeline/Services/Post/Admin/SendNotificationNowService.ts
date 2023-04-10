import HttpContext from '@ioc:Adonis/Core/HttpContext'
import { container, inject, injectable } from 'tsyringe'

import { GetDefaultLanguageService } from 'App/Modules/Language/Services/Language'
import { SendNotificationToAppService } from 'App/Modules/Notification/Services/Notification/SendNotificationToAppService'
import { StoreNotificationHistoryService } from 'App/Modules/Notification/Services/NotificationHistory'
import { getToScreenByType } from 'App/Modules/Notification/Utils/getToScreenByType'
import { IPost } from 'App/Modules/Timeline/Interfaces/IPost'
import { ITimelineCategorySubscriber } from 'App/Modules/Timeline/Interfaces/ITimelineCategorySubscriber'
import { getPostNotificationData } from 'App/Modules/Timeline/Utils/getPostNotificationData'
import NotFoundException from 'App/Shared/Exceptions/NotFoundException'
import PlatformTransitionQueue from 'App/Shared/Transitions/PlaformTransition/Queue/PlaformTransitionQueue'
import { IPlaformTransition } from 'App/Shared/Transitions/PlaformTransition/Types/IPlaformTransition'

@injectable()
export class SendNotificationNowService {
  constructor(
    @inject('PostsRepository')
    private postsRepository: IPost.Repository,
    @inject('TimelineCategorySubscriptionsRepository')
    private subscriptionsRepository: ITimelineCategorySubscriber.Repository
  ) {}

  public async run(postId: number) {
    const { i18n } = HttpContext.get()!

    const foundPost = await this.postsRepository.findBy('id', postId)
    if (!foundPost || !foundPost.is_activated) {
      throw new NotFoundException(
        i18n.formatMessage('messages.not_found', { model: i18n.formatMessage('models.post') })
      )
    }

    const getDefaultLanguageService = container.resolve(GetDefaultLanguageService)
    const defaultLanguage = await getDefaultLanguageService.run()

    if (!defaultLanguage) {
      throw new NotFoundException(
        i18n.formatMessage('messages.not_found', {
          model: i18n.formatMessage('models.language'),
        })
      )
    }

    const storeNotificationHistoryService = container.resolve(StoreNotificationHistoryService)
    const postNotificationData = getPostNotificationData(defaultLanguage.ref_code)

    if (postNotificationData) {
      await foundPost.load('timelineCategory')
      const isDefaultTimeline = foundPost.timelineCategory.is_default
      await foundPost.timelineCategory.load('groups')
      const groupIds = foundPost.timelineCategory.groups.map((group) => group.id)

      const memberIds = await this.subscriptionsRepository.pluckBy('user_id', {
        clauses: {
          where: {
            timeline_category_id: foundPost.timeline_category_id,
          },
        },
      })

      const { description, title } = postNotificationData

      const notificationHistory = await storeNotificationHistoryService.execute({
        title,
        description,
        type: 'post',
        link: '',
        extra_data: {
          post_id: foundPost.id,
        },
        for_all_users: true,
        to_screen: getToScreenByType('post'),
        hub_event_id: foundPost.hub_event_id,
      })

      const notificationTo = isDefaultTimeline ? 'all' : groupIds.length ? 'group' : 'users'

      PlatformTransitionQueue.add({
        type: IPlaformTransition.Types.notification,
        info: {
          notification_history_id: notificationHistory.id,
          to: notificationTo,
          userIds: memberIds,
          groupIds,
        },
      })

      const sendService = container.resolve(SendNotificationToAppService)
      await sendService.execute({
        notificationHistory,
        to: notificationTo,
        userIds: memberIds,
        groupIds,
      })
    }
  }
}
