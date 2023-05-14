import { container, delay } from 'tsyringe'

import { IUser } from 'App/Interfaces/IUser'
import UsersRepository from 'App/Repositories/UsersRepository'

container.registerSingleton<IUser.Repository>(
  'UsersRepository',
  delay(() => UsersRepository)
)
