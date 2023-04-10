import { DateTime } from 'luxon'
import { injectable } from 'tsyringe'

import UnpinPostQueue from 'App/Modules/Timeline/Queue/UnpinPostQueue'
import { calculeDelay } from 'App/Shared/Utils/calculeDelay'

type AddUnpinPostJobRequest = {
  postId: number
  fixationDeadline: DateTime
}

@injectable()
export class AddUnpinPostJobService {
  public async run({ fixationDeadline, postId }: AddUnpinPostJobRequest): Promise<void> {
    await UnpinPostQueue.add(
      { postId },
      {
        delay: calculeDelay(fixationDeadline),
        jobId: postId,
        removeOnComplete: true,
      }
    )
  }
}
