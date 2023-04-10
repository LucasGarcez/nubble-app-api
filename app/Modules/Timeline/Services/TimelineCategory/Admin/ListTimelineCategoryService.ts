import { inject, injectable } from 'tsyringe'

import { ITimelineCategory } from 'App/Modules/Timeline/Interfaces/ITimelineCategory'
import TimelineCategory from 'App/Modules/Timeline/Models/TimelineCategory'
import { PaginateContract } from 'App/Shared/Interfaces/IBaseRepository'

import DTO = ITimelineCategory.DTO

@injectable()
export class ListTimelineCategoryService {
  constructor(
    @inject('TimelineCategoriesRepository')
    private timelineCategoriesRepository: ITimelineCategory.Repository
  ) {}

  public async run(params: DTO.List): Promise<PaginateContract<typeof TimelineCategory>> {
    const { page = 1, perPage = 10, order } = params

    return this.timelineCategoriesRepository.listWithPagination({
      page,
      perPage,
      scopes: (scope) => {
        scope.loadGroups()
      },
      orders: [
        { column: 'is_default', direction: 'desc' },
        order ? order : { column: 'order', direction: 'asc' },
      ],
    })
  }
}
