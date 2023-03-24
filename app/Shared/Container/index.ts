import { container, delay } from 'tsyringe'

import { IUser } from 'App/Modules/Accounts/Interfaces/IUser'
import UsersRepository from 'App/Modules/Accounts/Repositories/UsersRepository'

container.registerSingleton<IUser.Repository>(
  'UsersRepository',
  delay(() => UsersRepository)
)
