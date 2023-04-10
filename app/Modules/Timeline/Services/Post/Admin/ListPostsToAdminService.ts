import HttpContext from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'
import { inject, injectable } from 'tsyringe'

import { IPost } from 'App/Modules/Timeline/Interfaces/IPost'
import { ITimelineCategory } from 'App/Modules/Timeline/Interfaces/ITimelineCategory'
import Post from 'App/Modules/Timeline/Models/Post'
import NotFoundException from 'App/Shared/Exceptions/NotFoundException'
import { OrderBy } from 'App/Shared/Interfaces/IBaseRepository'

type ListPostsToAdminRequest = {
  page: number
  perPage: number
  search: string
  timelineCategoryId?: number
  startDate?: DateTime
  endDate?: DateTime
  order: OrderBy<typeof Post>
  admin?: boolean
}

@injectable()
export class ListPostsToAdminService {
  constructor(
    @inject('PostsRepository')
    private postsRepository: IPost.Repository,
    @inject('TimelineCategoriesRepository')
    private timelineCategoriesRepository: ITimelineCategory.Repository
  ) {}

  public async run({
    order,
    page,
    perPage,
    search,
    endDate,
    startDate,
    timelineCategoryId,
    admin,
  }: ListPostsToAdminRequest) {
    const { i18n } = HttpContext.get()!

    if (!timelineCategoryId) {
      const defaultTimeline = await this.timelineCategoriesRepository.findBy('is_default', true)
      if (defaultTimeline) timelineCategoryId = defaultTimeline.id
      if (!timelineCategoryId)
        throw new NotFoundException(
          i18n.formatMessage('messages.not_found', {
            model: i18n.formatMessage('models.timeline_category'),
          })
        )
    }

    return this.postsRepository.listWithPagination({
      page,
      perPage,
      clauses: { where: { timeline_category_id: timelineCategoryId } },
      scopes: (scopes) => {
        scopes.loadUserForAdmin()
        scopes.loadContents()
        scopes.reactionCount()
        scopes.messageCount()
        if (startDate && endDate) scopes.filterByDate(startDate, endDate)
        if (admin) scopes.filterByAdmin()
        scopes.searchQueryScope(search)
        scopes.orderQueryScope([
          order && order.column
            ? { column: order.column, direction: order.direction }
            : { column: 'order_date', direction: 'desc' },
        ])
      },
    })
  }
}
