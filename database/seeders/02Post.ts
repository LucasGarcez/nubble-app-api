import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Post from 'App/Models/Post'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await Post.createMany([
      {
        user_id: 1,
        text: 'This is my first post!',
        imageUrl: 'https://i.imgur.com/VyfuWYa.jpg',
      },
      {
        user_id: 1,
        text: 'Check out this cool photo!',
        imageUrl: 'https://i.imgur.com/KkcrB5y.jpg',
      },
      {
        user_id: 1,
        text: "Just finished reading this book and it's amazing!",
        imageUrl: 'https://i.imgur.com/NdrA2BY.jpg',
      },
      {
        user_id: 2,
        text: "I can't believe it's already May!",
        imageUrl: 'https://i.imgur.com/vkscdqk.jpg',
      },
      {
        user_id: 2,
        text: 'Coding day!',
        imageUrl: 'https://i.imgur.com/rsOe2hC.jpg',
      },
      {
        user_id: 2,
        text: "What's your favorite color?",
        imageUrl: 'https://i.imgur.com/zx94i19.jpg',
      },
      {
        user_id: 3,
        text: "I'm so excited for the weekend!",
        imageUrl: 'https://i.imgur.com/LWopzZH.jpg',
      },
      {
        user_id: 3,
        text: 'Just got back from vacation and it was amazing!',
        imageUrl: 'https://i.imgur.com/WZZLeHg.jpg',
      },
      {
        user_id: 3,
        text: "I'm loving this new restaurant!",
        imageUrl: 'https://i.imgur.com/FmSbPv3.jpg',
      },
    ])
  }
}
