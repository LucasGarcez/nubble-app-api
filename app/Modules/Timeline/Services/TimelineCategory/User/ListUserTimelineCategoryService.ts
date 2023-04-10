import HttpContext from '@ioc:Adonis/Core/HttpContext'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import { inject, injectable } from 'tsyringe'

import { ITimelineCategory } from 'App/Modules/Timeline/Interfaces/ITimelineCategory'
import User from 'App/Modules/User/Models/User'
import NotFoundException from 'App/Shared/Exceptions/NotFoundException'

@injectable()
export class ListUserTimelineCategoryService {
  constructor(
    @inject('TimelineCategoriesRepository')
    private timelineCategoriesRepository: ITimelineCategory.Repository
  ) {}

  public async run(
    timelineCategoryId: number,
    page: number,
    perPage: number,
    search: string,
    commonUsers: boolean = false
  ): Promise<ModelPaginatorContract<User>> {
    const { i18n, currentUser: user } = HttpContext.get()!

    const groupIds = (await user.related('groups').query().select(['id'])).map((item) => item['id'])
    const timeline = await this.timelineCategoriesRepository.showUser(
      timelineCategoryId,
      user.id,
      groupIds
    )
    if (!timeline)
      throw new NotFoundException(
        i18n.formatMessage('messages.not_found', {
          model: i18n.formatMessage('models.timeline_category'),
        })
      )

    return this.timelineCategoriesRepository.getMembers(
      timeline,
      user.id,
      page,
      perPage,
      search,
      commonUsers
    )
  }
}
