import chalk from 'chalk'

import PostQueue from 'App/Modules/Timeline/Queue/PostQueue'

export class RemoveSchedulePostJobService {
  public async run(postId: number) {
    const schedulePostJobs = await PostQueue.getJobs(['delayed'])
    for (const job of schedulePostJobs) {
      if (job.id === String(postId)) {
        job.remove()
        console.log(` > post job ${job.id}`, chalk.red('removed'))
      }
    }
  }
}
