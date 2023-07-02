import { container, delay } from 'tsyringe'

import PostCommentRepository from 'App/Repositories/PostCommentsRepository'
import { IPostComment } from 'App/Interfaces/IPostComment'

container.registerSingleton<IPostComment.Repository>(
  'PostCommentRepository',
  delay(() => PostCommentRepository)
)
