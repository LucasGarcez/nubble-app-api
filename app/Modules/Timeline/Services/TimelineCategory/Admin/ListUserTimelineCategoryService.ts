import HttpContext from '@ioc:Adonis/Core/HttpContext'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import { inject, injectable } from 'tsyringe'

import { ITimelineCategory } from 'App/Modules/Timeline/Interfaces/ITimelineCategory'
import User from 'App/Modules/User/Models/User'
import NotFoundException from 'App/Shared/Exceptions/NotFoundException'

import DTO = ITimelineCategory.DTO

@injectable()
export class ListUserTimelineCategoryService {
  constructor(
    @inject('TimelineCategoriesRepository')
    private timelineCategoriesRepository: ITimelineCategory.Repository
  ) {}

  public async run(
    timelineId: number,
    { page = 1, perPage = 10, search = '' }: DTO.List
  ): Promise<ModelPaginatorContract<User>> {
    const ctx = HttpContext.get()!

    const timeline = await this.timelineCategoriesRepository.findBy('id', timelineId, {
      scopes: (scopes) => scopes.loadGroups(),
    })
    if (!timeline)
      throw new NotFoundException(
        ctx.i18n.formatMessage('messages.not_found', {
          model: ctx.i18n.formatMessage('models.timeline_category'),
        })
      )

    return timeline
      .related('users')
      .query()
      .withScopes((scopes) => {
        scopes.searchQueryScope(search)
      })
      .select(['id', 'name', 'email', 'avatar', 'online', 'created_at'])
      .paginate(page, perPage)
  }
}
