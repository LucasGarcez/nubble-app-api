import BaseRepository from 'App/Shared/Repositories/BaseRepository'
import { IUser } from 'App/Modules/Accounts/Interfaces/IUser'
import User from 'App/Modules/Accounts/Models/User'

export default class UsersRepository
  extends BaseRepository<typeof User>
  implements IUser.Repository
{
  constructor() {
    super(User)
  }
}
