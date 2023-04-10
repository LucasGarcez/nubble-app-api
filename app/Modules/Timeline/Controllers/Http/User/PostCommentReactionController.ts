import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { container } from 'tsyringe'

import {
  CreatePostCommentReactionService,
  DeletePostCommentReactionService,
  IndexPostCommentReactionService,
  UpdatePostCommentReactionService,
} from '../../../Services/PostCommentReaction/Shared'
import { PostCommentReactionValidators } from '../../../Validators/Shared/PostCommentReactionValidators'

/** services */

export default class PostCommentReactionController {
  public async store({ request, response, currentUser }: HttpContextContract): Promise<void> {
    const data = await request.validate(PostCommentReactionValidators.Store)
    const createService = container.resolve(CreatePostCommentReactionService)
    const postReaction = await createService.run({ ...data, user_id: currentUser.id })

    return response.json(postReaction)
  }

  public async destroy({
    params,
    response,
    currentUser,
    i18n,
  }: HttpContextContract): Promise<void> {
    const { commentId } = params

    const deleteService = container.resolve(DeletePostCommentReactionService)

    await deleteService.run(commentId, currentUser.id)

    return response.json({ message: i18n.formatMessage('messages.reaction_deleted') })
  }

  public async update({ request, response, currentUser }: HttpContextContract): Promise<void> {
    const data = await request.validate(PostCommentReactionValidators.Update)
    const updateService = container.resolve(UpdatePostCommentReactionService)

    const postReaction = await updateService.run({ ...data, user_id: currentUser.id })

    return response.json(postReaction)
  }

  public async index({ request, response }: HttpContextContract): Promise<void> {
    const page = request.input('page', 1)
    const postCommentId = request.input('post_comment_id', null)
    const reactionType = request.input('reaction_type', null)

    const indexService = container.resolve(IndexPostCommentReactionService)

    const posts = await indexService.run(page, postCommentId, reactionType)

    return response.json(posts)
  }
}
