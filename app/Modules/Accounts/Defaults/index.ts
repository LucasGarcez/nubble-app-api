import { ModelType } from 'App/Shared/Interfaces/BaseInterface'
import User from 'App/Modules/Accounts/Models/User'

type UserDefaultType = ModelType<typeof User>

export const UsersDefault: Array<UserDefaultType> = [
  {
    first_name: 'Root',
    last_name: 'User',
    username: 'root',
    email: 'root@acl.com',
    password: 'acl@2022',
  },
  {
    first_name: 'Admin',
    last_name: 'User',
    username: 'Admin',
    email: 'Admin@acl.com',
    password: 'acl@2022',
  },
]
