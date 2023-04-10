import HttpContext from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'
import { inject, injectable } from 'tsyringe'

import { ITimelineCategoryReaction } from 'App/Modules/Timeline/Interfaces/ITimelineCategoryReaction'
import TimelineCategoryReaction from 'App/Modules/Timeline/Models/TimelineCategoryReaction'
import NotFoundException from 'App/Shared/Exceptions/NotFoundException'

@injectable()
export class DeleteReactionService {
  constructor(
    @inject('TimelineCategoryReactionsRepository')
    private reactionsRepository: ITimelineCategoryReaction.Repository
  ) {}

  public async run(timelineCategoryId: number): Promise<TimelineCategoryReaction> {
    const { i18n, currentUser: user } = HttpContext.get()!

    const reaction = await this.reactionsRepository.findBy(
      'timeline_category_id',
      timelineCategoryId,
      {
        clauses: { where: { user_id: user.id } },
      }
    )
    if (!reaction)
      throw new NotFoundException(
        i18n.formatMessage('messages.not_found', {
          model: i18n.formatMessage('models.reaction'),
        })
      )

    reaction.merge({
      is_deleted: true,
      deleted_at: DateTime.now(),
    })
    await this.reactionsRepository.save(reaction)

    return reaction
  }
}
