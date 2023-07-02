import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Post from 'App/Models/Post';
import PostContent from 'App/Models/PostContent';
import User from 'App/Models/User'
import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';


export default class StartSeeder extends BaseSeeder {
  public async run() {
    const johndoeId = uuidv4();
    // const janesmithId = uuidv4();

    await User.createMany([
      {
        id: johndoeId,
        first_name: 'John',
        last_name: 'Doe',
        username: 'johndoe',
        email: 'johndoe@email.com',
        password: 'secret',
      },
      // {
      //   id: janesmithId,
      //   first_name: 'Jane',
      //   last_name: 'Smith',
      //   username: 'janesmith',
      //   email: 'janesmith@email.com',
      //   password: 'secret',
      // },
    ]
    )

    await Post.createMany([
      {
        user_id: johndoeId,
        text: 'This is my first post!',
        created_at: DateTime.now().minus({days: 3}),
        id: 1,
        
      }
    ])

    await PostContent.create({
      id: 1,
      post_id: 1,
      user_id: johndoeId,
      content_url: 'https://i.imgur.com/YeE3yKf.jpg',
      type: 'image',

    })
  }
}
