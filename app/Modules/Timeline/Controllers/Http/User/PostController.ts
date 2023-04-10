import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { container } from 'tsyringe'

import {
  StorePostService,
  DeletePostService,
  ListPostService,
  GetPostService,
  UpdatePostService,
} from 'App/Modules/Timeline/Services/Post/Shared'
import { PostValidators } from 'App/Modules/Timeline/Validators/Shared/PostValidators'

export default class PostController {
  public async index({ request, response, currentUser }: HttpContextContract): Promise<void> {
    const page = request.input('page', 1)
    const perPage = request.input('per_page', 10)
    const timelineCategoryId = request.input('timeline_category_id', null)

    const listPosts = container.resolve(ListPostService)
    const posts = await listPosts.execute({
      page,
      perPage,
      userId: currentUser.id,
      timelineCategoryId,
    })

    return response.json(posts)
  }

  public async show({ params, response, currentUser }: HttpContextContract): Promise<void> {
    const { id: postId } = params

    const getPost = container.resolve(GetPostService)
    const post = await getPost.execute({ postId, userId: currentUser.id })

    return response.json(post)
  }

  public async store({ request, response }: HttpContextContract): Promise<void> {
    const postDto = await request.validate(PostValidators.Store)
    const post = await container.resolve(StorePostService).execute(postDto)
    return response.json(post)
  }

  public async update({
    params,
    request,
    response,
    currentUser,
  }: HttpContextContract): Promise<void> {
    const { id: postId } = params
    const postData = await request.validate(PostValidators.Update)

    const updatePost = container.resolve(UpdatePostService)
    const post = await updatePost.execute(postId, currentUser.id, postData)

    return response.json(post)
  }

  public async destroy({
    params,
    response,
    currentUser,
    i18n,
  }: HttpContextContract): Promise<void> {
    const { id: postId } = params

    const deletePost = container.resolve(DeletePostService)
    await deletePost.execute(postId, currentUser.id)

    return response.json({ message: i18n.formatMessage('messages.post_deleted') })
  }
}
