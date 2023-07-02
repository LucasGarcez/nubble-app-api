import { container, delay } from 'tsyringe'

import { IPost } from 'App/Interfaces/IPost'
import PostsRepository from 'App/Repositories/PostsRepository'

container.registerSingleton<IPost.Repository>(
  'PostsRepository',
  delay(() => PostsRepository)
)
