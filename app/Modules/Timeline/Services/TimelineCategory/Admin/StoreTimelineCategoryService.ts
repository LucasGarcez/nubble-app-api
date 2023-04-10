import { inject, injectable } from 'tsyringe'

import { ITimelineCategory } from 'App/Modules/Timeline/Interfaces/ITimelineCategory'
import TimelineCategory from 'App/Modules/Timeline/Models/TimelineCategory'
import { IGroup } from 'App/Modules/User/Interfaces/IGroup'

import DTO = ITimelineCategory.DTO

@injectable()
export class StoreTimelineCategoryService {
  constructor(
    @inject('TimelineCategoriesRepository')
    private timelineCategoriesRepository: ITimelineCategory.Repository,
    @inject('GroupsRepository')
    private groupsRepository: IGroup.Repository
  ) {}

  public async run(data: DTO.Store, groupIds: number[]): Promise<TimelineCategory> {
    const timeline = await this.timelineCategoriesRepository.store(data)
    if (groupIds.length > 0) timeline.related('groups').attach(groupIds)
    else {
      const groupsIds = await this.groupsRepository.pluckBy('id', {
        clauses: {
          where: { active: true },
        },
      })
      await timeline.related('groups').attach(groupsIds)
      timeline.merge({
        view_type: 'public',
      })
      await timeline.save()
    }

    return timeline
  }
}
