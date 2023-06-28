import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import PostService from 'App/Services/PostService'
import { container } from 'tsyringe'

export class PostSeed extends BaseSeeder {
  public async run() {
    const postServices = container.resolve(PostService)

    postServices.store({
      text: 'This is a post',
      user_id: 1,
      is_activated: true,
      is_fixed: false,
    })
  }
}
