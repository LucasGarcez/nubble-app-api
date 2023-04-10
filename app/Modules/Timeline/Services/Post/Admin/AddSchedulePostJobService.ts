import Post from 'App/Modules/Timeline/Models/Post'
import PostQueue from 'App/Modules/Timeline/Queue/PostQueue'
import { calculeDelay } from 'App/Shared/Utils/calculeDelay'

export class AddSchedulePostJobService {
  public async run(post: Post): Promise<void> {
    await PostQueue.add(post, {
      jobId: post.id,
      delay: calculeDelay(post.schedule_date),
      removeOnComplete: true,
    })
  }
}
