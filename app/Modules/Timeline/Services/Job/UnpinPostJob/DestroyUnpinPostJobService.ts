import { injectable } from 'tsyringe'

import UnpinPostQueue from 'App/Modules/Timeline/Queue/UnpinPostQueue'

@injectable()
export class DestroyUnpinPostJobService {
  public async run(postId: number) {
    const unpinPostJobs = await UnpinPostQueue.getJobs(['delayed'])

    for (const unpinPostJob of unpinPostJobs) {
      if (unpinPostJob.id === postId) {
        unpinPostJob.remove()
      }
    }
  }
}
