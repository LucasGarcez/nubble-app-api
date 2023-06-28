import { container, delay } from 'tsyringe'

import PostReactionRepository from 'App/Repositories/PostReactionsRepository'
import { IPostReaction } from 'App/Interfaces/IPostReaction'

container.registerSingleton<IPostReaction.Repository>(
  'PostReactionRepository',
  delay(() => PostReactionRepository)
)
