import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        firstName: 'Romain',
        lastName: 'Lanz',
        username: 'romainlanz',
        profileURL: 'https://i.imgur.com/BxgHDci.jpg',
        email: 'virk@adonisjs.com',
        password: 'supersecret',
      },
      {
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        profileURL: 'https://i.imgur.com/BxgHDci.jpg',
        email: 'romain@adonisjs.com',
        password: 'supersecret',
      },
      {
        firstName: 'Austin',
        lastName: 'Jack',
        username: 'austin',
        profileURL: 'https://i.imgur.com/OGQRFok.jpg',
        email: 'austin@adonisjs.com',
        password: 'supersecret',
      },
    ])
  }
}
