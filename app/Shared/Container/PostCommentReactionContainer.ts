import { container, delay } from 'tsyringe'

import PostCommentReactionRepository from 'App/Repositories/PostCommentReactionsRepository'
import { IPostCommentReaction } from 'App/Interfaces/IPostCommentReaction'

container.registerSingleton<IPostCommentReaction.Repository>(
  'PostCommentReactionRepository',
  delay(() => PostCommentReactionRepository)
)
