import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { container } from 'tsyringe'

import {
  CreatePostReactionService,
  DeletePostReactionService,
  IndexPostReactionService,
  UpdatePostReactionService,
} from '../../../Services/PostReaction/Shared'
import { PostReactionValidators } from '../../../Validators/Shared/PostReactionValidators'

/** services */

export default class PostReactionController {
  public async store({ request, response, currentUser }: HttpContextContract): Promise<void> {
    const data = await request.validate(PostReactionValidators.Store)
    const createService = container.resolve(CreatePostReactionService)
    const postReaction = await createService.run({ ...data, user_id: currentUser.id })

    return response.json(postReaction)
  }

  public async destroy({
    params,
    response,
    currentUser,
    i18n,
  }: HttpContextContract): Promise<void> {
    const { postId } = params

    const deleteService = container.resolve(DeletePostReactionService)

    await deleteService.run(postId, currentUser.id)

    return response.json({ message: i18n.formatMessage('messages.reaction_deleted') })
  }

  public async update({ request, response, currentUser }: HttpContextContract): Promise<void> {
    const data = await request.validate(PostReactionValidators.Update)
    const updateService = container.resolve(UpdatePostReactionService)

    const postReaction = await updateService.run({ ...data, user_id: currentUser.id })

    return response.json(postReaction)
  }

  public async index({ request, response }: HttpContextContract): Promise<void> {
    const page = request.input('page', 1)
    const postId = request.input('post_id', null)
    const reactionType = request.input('reaction_type', null)

    const indexService = container.resolve(IndexPostReactionService)

    const posts = await indexService.run(page, postId, reactionType)

    return response.json(posts)
  }
}
