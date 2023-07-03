import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Post from 'App/Models/Post'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await Post.createMany([
      {
        user_id: 1,
        text: 'This is my first post!',
        author: {
          profileURL: 'https://i.imgur.com/YeE3yKf.jpg',
          name: 'John Doe',
          userName: 'johndoe',
        },
        imageUrl: 'https://i.imgur.com/VyfuWYa.jpg',
      },
      {
        user_id: 1,
        text: 'Check out this cool photo!',
        author: {
          profileURL: 'https://i.imgur.com/BrJUnRl.jpg',
          name: 'Jane Smith',
          userName: 'janesmith',
        },
        imageUrl: 'https://i.imgur.com/KkcrB5y.jpg',
      },
      {
        user_id: 1,
        text: "Just finished reading this book and it's amazing!",
        author: {
          profileURL: 'https://i.imgur.com/BxgHDci.jpg',
          name: 'Mark Johnson',
          userName: 'markjohnson',
        },
        imageUrl: 'https://i.imgur.com/NdrA2BY.jpg',
      },
      {
        user_id: 2,
        text: "I can't believe it's already May!",
        author: {
          profileURL: 'https://i.imgur.com/FmSbPv3.jpg',
          name: 'Amy Lee',
          userName: 'amylee',
        },
        imageUrl: 'https://i.imgur.com/vkscdqk.jpg',
      },
      {
        user_id: 2,
        text: 'Coding day!',
        author: {
          profileURL: 'https://i.imgur.com/DF4Jfxq.jpg',
          name: 'Santiago Emilio',
          userName: 'sanemilio',
        },
        imageUrl: 'https://i.imgur.com/rsOe2hC.jpg',
      },
      {
        user_id: 2,
        text: "What's your favorite color?",
        author: {
          profileURL: 'https://i.imgur.com/YeE3yKf.jpg',
          name: 'John Doe',
          userName: 'johndoe',
        },
        imageUrl: 'https://i.imgur.com/zx94i19.jpg',
      },
      {
        user_id: 3,
        text: "I'm so excited for the weekend!",
        author: {
          profileURL: 'https://i.imgur.com/BrJUnRl.jpg',
          name: 'Jane Smith',
          userName: 'janesmith',
        },
        imageUrl: 'https://i.imgur.com/LWopzZH.jpg',
      },
      {
        user_id: 3,
        text: 'Just got back from vacation and it was amazing!',
        author: {
          profileURL: 'https://i.imgur.com/BxgHDci.jpg',
          name: 'Mark Johnson',
          userName: 'markjohnson',
        },
        imageUrl: 'https://i.imgur.com/WZZLeHg.jpg',
      },
      {
        user_id: 3,
        text: "I'm loving this new restaurant!",
        imageUrl: 'https://i.imgur.com/FmSbPv3.jpg',
        author: {
          profileURL: 'https://i.imgur.com/OGQRFok.jpg',
          name: 'Amy Lee',
          userName: 'amylee',
        },
      },
    ])
  }
}
