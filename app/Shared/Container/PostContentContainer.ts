import { container, delay } from 'tsyringe'

import PostContentRepository from 'App/Repositories/PostContentsRepository'
import { IPostContent } from 'App/Interfaces/IPostContent'

container.registerSingleton<IPostContent.Repository>(
  'PostContentRepository',
  delay(() => PostContentRepository)
)
