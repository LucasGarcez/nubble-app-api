import BaseRepository from 'App/Shared/Repositories/BaseRepository'
import { IUser } from 'App/Interfaces/IUser'
import User from 'App//Models/User'

export default class UsersRepository
  extends BaseRepository<typeof User>
  implements IUser.Repository
{
  constructor() {
    super(User)
  }
}
