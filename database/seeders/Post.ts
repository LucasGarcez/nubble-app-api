import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Post from 'App/Models/Post'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await Post.createMany([
      {
        text: 'Romain',
        user_id: 1,
      },
      {
        text: 'Romain',
        user_id: 1,
      },
    ])
  }
}
