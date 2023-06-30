import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        first_name: 'Romain',
        last_name: 'Lanz',
        username: 'romainlanz',
        email: 'virk@adonisjs.com',
        password: 'secret',
      },
      {
        first_name: 'John',
        last_name: 'Doe',
        username: 'johndoe',
        email: 'romain@adonisjs.com',
        password: 'supersecret',
      },
    ])
  }
}
