import { inject, injectable } from 'tsyringe'

import { ITimelineCategoryReaction } from 'App/Modules/Timeline/Interfaces/ITimelineCategoryReaction'
import TimelineCategoryReaction from 'App/Modules/Timeline/Models/TimelineCategoryReaction'

@injectable()
export class StoreReactionService {
  constructor(
    @inject('TimelineCategoryReactionsRepository')
    private reactionsRepository: ITimelineCategoryReaction.Repository
  ) {}

  public async run(data: ITimelineCategoryReaction.DTO.Store): Promise<TimelineCategoryReaction> {
    return this.reactionsRepository.store(data)
  }
}
