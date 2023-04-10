import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { container } from 'tsyringe'

import {
  CreatePostCommentService,
  DeletePostCommentService,
  IndexPostCommentService,
  ShowPostCommentService,
  UpdatePostCommentService,
} from '../../../Services/PostComment/Shared'
import { PostCommentValidators } from '../../../Validators/Shared/PostCommentValidators'

/** --- services --- */

export default class PostCommentController {
  public async store({ request, response, currentUser }: HttpContextContract): Promise<void> {
    const data = await request.validate(PostCommentValidators.Store)

    const createService = container.resolve(CreatePostCommentService)

    const postComment = await createService.run({ ...data, user_id: currentUser.id })

    return response.json(postComment)
  }

  public async update({
    request,
    response,
    params,
    currentUser,
  }: HttpContextContract): Promise<void> {
    const data = await request.validate(PostCommentValidators.Update)
    const { commentId } = params

    const updateService = container.resolve(UpdatePostCommentService)
    const postComment = await updateService.run({ ...data }, commentId, currentUser.id)

    return response.json(postComment)
  }

  public async show({ response, params, currentUser }: HttpContextContract): Promise<void> {
    const { commentId } = params

    const showService = container.resolve(ShowPostCommentService)
    const postComment = await showService.run(commentId, currentUser.id)

    return response.json(postComment)
  }

  public async index({ request, response, currentUser }: HttpContextContract): Promise<void> {
    const page = request.input('page', 1)
    const perPage = request.input('per_page', 10)
    const postId = request.input('post_id', null)
    const postCommentId = request.input('reply_comment_id', null)

    const indexService = container.resolve(IndexPostCommentService)
    const postComment = await indexService.run(page, postId, postCommentId, currentUser.id, perPage)

    return response.json(postComment)
  }

  public async destroy({
    response,
    params,
    currentUser,
    i18n,
  }: HttpContextContract): Promise<void> {
    const { commentId } = params

    const deleteService = container.resolve(DeletePostCommentService)
    await deleteService.run(commentId, currentUser.id)

    return response.json({ message: i18n.formatMessage('messages.comment_deleted') })
  }
}
