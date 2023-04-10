import HttpContext from '@ioc:Adonis/Core/HttpContext'
import { inject, injectable } from 'tsyringe'

import { IPost } from 'App/Modules/Timeline/Interfaces/IPost'
import { ITimelineCategory } from 'App/Modules/Timeline/Interfaces/ITimelineCategory'
import Post from 'App/Modules/Timeline/Models/Post'
import NotFoundException from 'App/Shared/Exceptions/NotFoundException'
import { PaginateContract } from 'App/Shared/Interfaces/IBaseRepository'

import DTO = IPost.DTO

@injectable()
export class ListPostService {
  constructor(
    @inject('PostsRepository')
    private postsRepository: IPost.Repository,
    @inject('TimelineCategoriesRepository')
    private timelineCategoriesRepository: ITimelineCategory.Repository
  ) {}

  public async execute({
    page = 1,
    perPage = 10,
    userId = undefined,
    timelineCategoryId = undefined,
    startDate = undefined,
    endDate = undefined,
    order = undefined,
  }: DTO.List): Promise<PaginateContract<typeof Post>> {
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
        scopes.loadUser()
        scopes.onlyPublished()
        scopes.loadContents()
        scopes.reactionCount()
        scopes.messageCount()
        if (userId) scopes.ignoreDenunciations(userId)
        if (userId) scopes.loadAlreadyReact(userId)
        if (startDate && endDate) scopes.filterByDate(startDate, endDate)
        scopes.orderQueryScope(
          order && order.column
            ? [{ column: order.column, direction: order.direction }]
            : [
                { column: 'order_date', direction: 'desc' },
                {
                  column: 'id',
                  direction: 'asc',
                },
              ]
        )
      },
    })
  }
}
