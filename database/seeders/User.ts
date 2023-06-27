import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import UserServices from 'App/Services/UserServices'
import { container } from 'tsyringe'

export class UserSeed extends BaseSeeder {
  public async run() {
    const userServices = container.resolve(UserServices)

    userServices.store({
      first_name: 'Lucas',
      last_name: 'Garcez',
      email: 'lucasgarcez@gmail.com',
      username: 'LucasGarcez',
      password: 'lucasgar6',
    })
  }
}
