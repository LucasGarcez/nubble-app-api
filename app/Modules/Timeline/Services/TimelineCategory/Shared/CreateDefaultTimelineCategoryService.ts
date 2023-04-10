import { inject, injectable } from 'tsyringe'

import { DefaultTimelineCategories } from 'App/Modules/Timeline/Defaults/TimelineCategories'
import { ITimelineCategory } from 'App/Modules/Timeline/Interfaces/ITimelineCategory'
import { IGroup } from 'App/Modules/User/Interfaces/IGroup'

@injectable()
export class CreateDefaultTimelineCategoryService {
  constructor(
    @inject('TimelineCategoriesRepository')
    private timelineCategoriesRepository: ITimelineCategory.Repository,
    @inject('GroupsRepository')
    private groupsRepository: IGroup.Repository
  ) {}

  public async run(hubEventId: number) {
    for (const defaultTimelineCategory of DefaultTimelineCategories) {
      const timelineCategory = await this.timelineCategoriesRepository.findOrStore(
        defaultTimelineCategory,
        {
          ...defaultTimelineCategory,
          hub_event_id: hubEventId,
        }
      )

      /**
       * attach on all groups
       */
      const groupsIds = await this.groupsRepository.pluckBy('id')
      await timelineCategory.related('groups').attach(groupsIds)
    }
  }
}
