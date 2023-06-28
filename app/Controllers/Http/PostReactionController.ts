import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { container } from 'tsyringe'

import {
  CreatePostReactionService,
  DeletePostReactionService,
  IndexPostReactionService,
  UpdatePostReactionService,
} from 'App/Services/PostReaction/Shared'
import { PostReactionValidators } from 'App/Validators/PostReactionValidators'

/** services */

export default class PostReactionController {
  public async store({ request, response }: HttpContextContract): Promise<void> {
    const data = await request.validate(PostReactionValidators.Store)
    const currentUser = request.input('user')
    const createService = container.resolve(CreatePostReactionService)
    const postReaction = await createService.run({ ...data, user_id: currentUser.id })

    return response.json(postReaction)
  }

  public async destroy({ request, params, response }: HttpContextContract): Promise<void> {
    const { postId } = params
    const currentUser = request.input('user')
    const deleteService = container.resolve(DeletePostReactionService)

    await deleteService.run(postId, currentUser.id)

    return response.json({ message: 'Reaction deleted.' })
  }

  public async update({ request, response }: HttpContextContract): Promise<void> {
    const data = await request.validate(PostReactionValidators.Update)
    const currentUser = request.input('user')

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
