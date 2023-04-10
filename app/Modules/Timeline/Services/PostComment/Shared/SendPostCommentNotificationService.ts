import { container, inject, injectable } from 'tsyringe'

import { INotification } from 'App/Modules/Notification/Interfaces/INotification'
import { INotificationHistory } from 'App/Modules/Notification/Interfaces/INotificationHistory'
import { SendNotificationToAppService } from 'App/Modules/Notification/Services/Notification/SendNotificationToAppService'
import { StoreNotificationHistoryService } from 'App/Modules/Notification/Services/NotificationHistory'
import { IPostComment } from 'App/Modules/Timeline/Interfaces/IPostComment'
import { getPostCommentNotificationData } from 'App/Modules/Timeline/Utils/getPostCommentNotificationData'
import PlatformTransitionQueue from 'App/Shared/Transitions/PlaformTransition/Queue/PlaformTransitionQueue'
import { IPlaformTransition } from 'App/Shared/Transitions/PlaformTransition/Types/IPlaformTransition'

type SendPostCommentNotificationRequest = {
  ownerId: number
  postId: number
  newerCommentUser: {
    id: number
    name: string
  }
  ownerLanguageRefCode: string
}

@injectable()
export class SendPostCommentNotificationService {
  constructor(
    @inject('PostCommentRepository')
    private postCommentRepository: IPostComment.Repository,
    @inject('NotificationHistoryRepository')
    private notificationHistoryRepository: INotificationHistory.Repository
  ) {}

  public async run({
    newerCommentUser,
    ownerId,
    ownerLanguageRefCode,
    postId,
  }: SendPostCommentNotificationRequest) {
    const userCount = await this.postCommentRepository.getUserCountByPost(postId)

    const notificationTexts = getPostCommentNotificationData(
      userCount,
      newerCommentUser.name,
      ownerLanguageRefCode
    )

    if (notificationTexts) {
      const { description, title } = notificationTexts

      const notificationHistoryPayload: INotificationHistory.DTO.Store = {
        title,
        description,
        type: INotification.NotificationTypes.postComment,
        for_all_users: false,
        user_id: ownerId,
        link: '',
        extra_data: {
          post_id: postId,
        },
      }

      if (userCount > 0)
        await this.notificationHistoryRepository.destroy({
          type: INotification.NotificationTypes.postComment,
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
