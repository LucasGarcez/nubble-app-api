import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Post from 'App/Models/Post'
import { DateTime } from 'luxon'

export default class PostSeeder extends BaseSeeder {
  public async run() {
    await Post.createMany([
      {
        user_id: 1,
        text: 'Bom dia!',
        imageUrl: 'https://nubble-development.s3.sa-east-1.amazonaws.com/backend-integration/post1.jpg',
        created_at: DateTime.now()
      },
      {
        user_id: 2,
        text: 'Vivendo no paraíso!',
        imageUrl: 'https://nubble-development.s3.sa-east-1.amazonaws.com/backend-integration/post2.jpg',
        created_at: DateTime.now().minus({ minute: 40}),
      },
      {
        user_id: 3,
        text: 'Mais uma nessa trip incrível',
        imageUrl: 'https://nubble-development.s3.sa-east-1.amazonaws.com/backend-integration/post3.jpg',
        created_at: DateTime.now().minus({ hour: 1, minute: 20}),
      },
      {
        user_id: 4,
        text: 'Flinders station - Melbourne',
        imageUrl: 'https://nubble-development.s3.sa-east-1.amazonaws.com/backend-integration/post4.jpg',
        created_at: DateTime.now().minus({ hour: 3, minute: 30}),

      },
      {
        user_id: 5,
        text: 'Explorando os restaurantes de Melbourne',
        imageUrl: 'https://nubble-development.s3.sa-east-1.amazonaws.com/backend-integration/post5.jpg',
      },
      {
        user_id: 6,
        text: 'Pensando seriamente em morar aqui',
        imageUrl: 'https://nubble-development.s3.sa-east-1.amazonaws.com/backend-integration/post6.jpg',
        created_at: DateTime.now().minus({ hour: 3}),
      },
      {
        user_id: 7,
        text: 'A cidade grande tem seu charme',
        imageUrl: 'https://nubble-development.s3.sa-east-1.amazonaws.com/backend-integration/post7.jpg',
        created_at: DateTime.now().minus({ hour: 4}),
      },
      {
        user_id: 8,
        text: 'Final de campeonato, vamos pra cima 🚀',
        imageUrl: 'https://nubble-development.s3.sa-east-1.amazonaws.com/backend-integration/post8.jpg',
        created_at: DateTime.now().minus({ hour: 8}),
      },
      
      {
        user_id: 9,
        text: 'Noite de cinema com a família',
        imageUrl: 'https://nubble-development.s3.sa-east-1.amazonaws.com/backend-integration/post9.jpg',
        created_at: DateTime.now().minus({ hour: 10}),
      },
      {
        user_id: 2,
        text: 'Time to fly!',
        imageUrl: 'https://nubble-development.s3.sa-east-1.amazonaws.com/backend-integration/post10.jpg',
        created_at: DateTime.now().minus({ hour: 15}),
      },
      {
        user_id: 3,
        text: 'Com toda certeza a melhor forma de aproveitar uma sexta feira de inverno é assistindo sua série favorita.',
        imageUrl: 'https://nubble-development.s3.sa-east-1.amazonaws.com/backend-integration/post11.jpg',
        created_at: DateTime.now().minus({days: 1, hour: 1}),
      },
      {
        user_id: 1,
        text: 'Chove chuva, chove sem parar ☔️',
        imageUrl: 'https://nubble-development.s3.sa-east-1.amazonaws.com/backend-integration/post12.jpg',
        created_at: DateTime.now().minus({days: 1, hour: 1}),
      },
      {
        user_id: 4,
        text: 'Vrum vrum 🏍',
        imageUrl: 'https://nubble-development.s3.sa-east-1.amazonaws.com/backend-integration/post13.jpg',
        created_at: DateTime.now().minus({days: 1, hour: 1}),
      },
      {
        user_id: 7,
        text: 'Com toda certeza o Rio de Janeiro é uma das cidades mais lindas do mundo, e o Cristo Redentor é um dos pontos turísticos mais bonitos que já visitei.',
        imageUrl: 'https://nubble-development.s3.sa-east-1.amazonaws.com/backend-integration/post14.jpg',
        created_at: DateTime.now().minus({days: 1, hour: 1, minutes: 45}),
      },
      {
        user_id: 9,
        text: 'A noite me traz paz',
        imageUrl: 'https://nubble-development.s3.sa-east-1.amazonaws.com/backend-integration/post15.jpg',
        created_at: DateTime.now().minus({days: 1, hour: 2, minutes: 30}),
      },
      {
        user_id: 3,
        text: 'Ansioso para esse final de semana longe da cidade grande',
        imageUrl: 'https://nubble-development.s3.sa-east-1.amazonaws.com/backend-integration/post16.jpg',
        created_at: DateTime.now().minus({days: 1, hour: 4}),

      },
      {
        user_id: 1,
        text: 'home office be like: 🤓',
        imageUrl: 'https://nubble-development.s3.sa-east-1.amazonaws.com/backend-integration/post17.jpg',
        created_at: DateTime.now().minus({days: 2, minutes: 12}),

      },
      {
        user_id: 5,
        text: 'Não, essa foto não foi tirada no Caribe ou em alguma ilha paradisíaca, essa foto foi tirada em uma praia aqui no Brasil, no Rio de Janeiro, mas precisamente em Arraial do Cabo. O Brasil é um país lindo, e temos que valorizar mais o que temos aqui.',
        imageUrl: 'https://nubble-development.s3.sa-east-1.amazonaws.com/backend-integration/post18.jpg',
        created_at: DateTime.now().minus({days: 2, minutes: 23}),

      },
      {
        user_id: 8,
        text: 'Nada melhor do que começar a semana com aquele treino matinal',
        imageUrl: 'https://nubble-development.s3.sa-east-1.amazonaws.com/backend-integration/post19.jpg',
        created_at: DateTime.now().minus({days: 2, minutes: 30}),
      },
      {
        user_id: 9,
        text: 'E aí, tem coragem de dormir aqui?',
        imageUrl: 'https://nubble-development.s3.sa-east-1.amazonaws.com/backend-integration/post20.jpg',
        created_at: DateTime.now().minus({days: 3, minutes: 30}),
      },
      {
        user_id: 1,
        text: 'No coffee no code ☕️',
        imageUrl: 'https://nubble-development.s3.sa-east-1.amazonaws.com/backend-integration/post21.jpg',
        created_at: DateTime.now().minus({days: 3, hour: 1}),
      },
      {
        user_id: 3,
        text: 'Que noite! 🎉',
        imageUrl: 'https://nubble-development.s3.sa-east-1.amazonaws.com/backend-integration/post22.jpg',
        created_at: DateTime.now().minus({days: 3, hour: 4}),
      },
      {
        user_id: 6,
        text: 'Mais uma noite de muito código',
        imageUrl: 'https://nubble-development.s3.sa-east-1.amazonaws.com/backend-integration/post23.jpg',
        created_at: DateTime.now().minus({weeks: 1}),
      },
      {
        user_id: 7,
        text: 'Good morning!',
        imageUrl: 'https://nubble-development.s3.sa-east-1.amazonaws.com/backend-integration/post24.jpg',
        created_at: DateTime.now().minus({weeks: 1, hour: 4}),
      },
    ])
  }
}