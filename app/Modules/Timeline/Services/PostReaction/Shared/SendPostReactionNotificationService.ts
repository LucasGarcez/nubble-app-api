import { container, inject, injectable } from 'tsyringe'

import { INotification } from 'App/Modules/Notification/Interfaces/INotification'
import { INotificationHistory } from 'App/Modules/Notification/Interfaces/INotificationHistory'
import { SendNotificationToAppService } from 'App/Modules/Notification/Services/Notification/SendNotificationToAppService'
import { StoreNotificationHistoryService } from 'App/Modules/Notification/Services/NotificationHistory'
import { IPostReaction } from 'App/Modules/Timeline/Interfaces/IPostReaction'
import { getPostReactionNotificationData } from 'App/Modules/Timeline/Utils/getPostReactionNotificationData'
import PlatformTransitionQueue from 'App/Shared/Transitions/PlaformTransition/Queue/PlaformTransitionQueue'
import { IPlaformTransition } from 'App/Shared/Transitions/PlaformTransition/Types/IPlaformTransition'

type SendPostReactionNotificationRequest = {
  ownerId: number
  postId: number
  newerReactionUser: {
    id: number
    name: string
  }
  ownerLanguageRefCode: string
}

@injectable()
export class SendPostReactionNotificationService {
  constructor(
    @inject('PostReactionRepository')
    private postReactionRepository: IPostReaction.Repository,
    @inject('NotificationHistoryRepository')
    private notificationHistoryRepository: INotificationHistory.Repository
  ) {}

  public async run({
    newerReactionUser,
    ownerId,
    ownerLanguageRefCode,
    postId,
  }: SendPostReactionNotificationRequest) {
    const userCount = await this.postReactionRepository.getUserCountByPost(postId)

    const notificationTexts = getPostReactionNotificationData(
      userCount,
      newerReactionUser.name,
      ownerLanguageRefCode
    )

    if (notificationTexts) {
      const { description, title } = notificationTexts

      const notificationHistoryPayload: INotificationHistory.DTO.Store = {
        title,
        description,
        type: INotification.NotificationTypes.postReaction,
        for_all_users: false,
        user_id: ownerId,
        link: '',
        extra_data: {
          post_id: postId,
        },
      }

      if (userCount > 0)
        await this.notificationHistoryRepository.destroy({
          type: INotification.NotificationTypes.postReaction,
          user_id: ownerId,
          extra_data: {
            post_id: postId,
          },
        })

      const storeNotificationHistoryService = container.resolve(StoreNotificationHistoryService)
      const notificationHistory = await storeNotificationHistoryService.execute(
        notificationHistoryPayload
      )
      PlatformTransitionQueue.add({
        type: IPlaformTransition.Types.notification,
        info: {
          notification_history_id: notificationHistory.id,
          to: 'users',
          userIds: [ownerId],
        },
      })
      const sendService = container.resolve(SendNotificationToAppService)
      await sendService.execute({
        notificationHistory,
        userIds: [ownerId],
        to: 'users',
      })
    }
  }
}
