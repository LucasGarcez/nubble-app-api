import HttpContext from '@ioc:Adonis/Core/HttpContext'
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

  public async run({
    page = 1,
    perPage = 10,
  }: DTO.List): Promise<PaginateContract<typeof TimelineCategory>> {
    const { currentUser: user } = HttpContext.get()!

    const groupIds = (await user.related('groups').query().select(['id'])).map((item) => item['id'])

    return this.timelineCategoriesRepository.listWithPagination({
      page,
      perPage,
      scopes: (scopes) => {
        scopes.loadPermission(groupIds)
        scopes.filterVisibility(groupIds)
        scopes.loadSubcribe(user.id)
        scopes.loadAlreadyReact(user.id)
      },
      orders: [
        { column: 'is_default', direction: 'desc' },
        { column: 'order', direction: 'asc' },
      ],
    })
  }
}
