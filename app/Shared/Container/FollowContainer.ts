import { container, delay } from 'tsyringe'

import { IFollow } from 'App/Interfaces/IFollow'
import FollowRepository from 'App/Repositories/FollowRepository'

container.registerSingleton<IFollow.Repository>(
  'FollowRepository',
  delay(() => FollowRepository)
)
