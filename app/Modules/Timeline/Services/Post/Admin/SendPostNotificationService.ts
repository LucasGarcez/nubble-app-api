import { container } from 'tsyringe'

import { SendNotificationToAppService } from 'App/Modules/Notification/Services/Notification/SendNotificationToAppService'
import { SendNotificationToPlatformService } from 'App/Modules/Notification/Services/Notification/SendNotificationToPlatformService'
import { StoreNotificationHistoryService } from 'App/Modules/Notification/Services/NotificationHistory'
import Post from 'App/Modules/Timeline/Models/Post'

export class SendPostNotificationService {
  public async run(post: Post) {
    const storeNotificationHistoryService = container.resolve(StoreNotificationHistoryService)
    const sendNotificationToAppService = container.resolve(SendNotificationToAppService)
    const sendNotificationToPlatformService = container.resolve(SendNotificationToPlatformService)

    const notificationHistory = await storeNotificationHistoryService.execute({
      title: 'Nova publicação',
      description: 'Nova publicação',
      extra_data: {
        post_id: post.id,
      },
      type: 'post',
      for_all_users: true,
      link: '',
      user_id: post.user_id,
      icon: '',
    })

    await sendNotificationToAppService.execute({ notificationHistory, to: 'all' })
    await sendNotificationToPlatformService.execute({
      notificationHistory,
      to: 'all',
    })
  }
}
