import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Post from 'App/Models/Post'
import { DateTime } from 'luxon'

export default class PostSeeder extends BaseSeeder {
  public async run() {
    await Post.createMany([
      {
        user_id: 1,
        text: 'Bom dia!',
        imageUrl: 'https://imgur.com/Ms5ULHg.jpg',
        created_at: DateTime.now()
      },
      {
        user_id: 2,
        text: 'Vivendo no paraíso!',
        imageUrl: 'https://imgur.com/Mbz374Z.jpg',
        created_at: DateTime.now().minus({ minute: 40}),
      },
      {
        user_id: 3,
        text: 'Mais uma nessa trip incrível',
        imageUrl: 'https://imgur.com/AUqmzIU.jpg',
        created_at: DateTime.now().minus({ hour: 1, minute: 20}),
      },
      {
        user_id: 4,
        text: 'Flinders station - Melbourne',
        imageUrl: 'https://imgur.com/EqCXHAs.jpg',
        created_at: DateTime.now().minus({ hour: 3, minute: 30}),

      },
      {
        user_id: 5,
        text: 'Explorando os restaurantes de Melbourne',
        imageUrl: 'https://imgur.com/Bynjevi.jpg',
      },
      {
        user_id: 6,
        text: 'Pensando seriamente em morar aqui',
        imageUrl: 'https://imgur.com/Uf3VgUK.jpg',
        created_at: DateTime.now().minus({ hour: 3}),
      },
      {
        user_id: 7,
        text: 'A cidade grande tem seu charme',
        imageUrl: 'https://imgur.com/SehklSh.jpg',
        created_at: DateTime.now().minus({ hour: 4}),
      },
      {
        user_id: 8,
        text: 'Final de campeonato, vamos pra cima 🚀',
        imageUrl: 'https://imgur.com/kJcnVat.jpg',
        created_at: DateTime.now().minus({ hour: 8}),
      },
      
      {
        user_id: 9,
        text: 'Noite de cinema com a família',
        imageUrl: 'https://imgur.com/6wijwyW.jpg',
        created_at: DateTime.now().minus({ hour: 10}),
      },
      {
        user_id: 2,
        text: 'Time to fly!',
        imageUrl: 'https://imgur.com/tsVvRxD.jpg',
        created_at: DateTime.now().minus({ hour: 15}),
      },
      {
        user_id: 3,
        text: 'Com toda certeza a melhor forma de aproveitar uma sexta feira de inverno é assistindo sua série favorita.',
        imageUrl: 'https://imgur.com/65zPY1q.jpg',
        created_at: DateTime.now().minus({days: 1, hour: 1}),
      },
      {
        user_id: 1,
        text: 'Chove chuva, chove sem parar ☔️',
        imageUrl: 'https://imgur.com/HjKc6o4.jpg',
        created_at: DateTime.now().minus({days: 1, hour: 1}),
      },
      {
        user_id: 4,
        text: 'Vrum vrum 🏍',
        imageUrl: 'https://imgur.com/f8RDcCv.jpg',
        created_at: DateTime.now().minus({days: 1, hour: 1}),
      },
      {
        user_id: 7,
        text: 'Com toda certeza o Rio de Janeiro é uma das cidades mais lindas do mundo, e o Cristo Redentor é um dos pontos turísticos mais bonitos que já visitei.',
        imageUrl: 'https://imgur.com/WGOhCeT.jpg',
        created_at: DateTime.now().minus({days: 1, hour: 1, minutes: 45}),
      },
      {
        user_id: 9,
        text: 'A noite me traz paz',
        imageUrl: 'https://imgur.com/7Nsp28d.jpg',
        created_at: DateTime.now().minus({days: 1, hour: 2, minutes: 30}),
      },
      {
        user_id: 3,
        text: 'Ansioso para esse final de semana longe da cidade grande',
        imageUrl: 'https://imgur.com/1Hv0dIT.jpg',
        created_at: DateTime.now().minus({days: 1, hour: 4}),

      },
      {
        user_id: 1,
        text: 'home office be like: 🤓',
        imageUrl: 'https://imgur.com/Cm8braU.jpg',
        created_at: DateTime.now().minus({days: 2, minutes: 12}),

      },
      {
        user_id: 5,
        text: 'Não, essa foto não foi tirada no Caribe ou em alguma ilha paradisíaca, essa foto foi tirada em uma praia aqui no Brasil, no Rio de Janeiro, mas precisamente em Arraial do Cabo. O Brasil é um país lindo, e temos que valorizar mais o que temos aqui.',
        imageUrl: 'https://imgur.com/mUkoAha.jpg',
        created_at: DateTime.now().minus({days: 2, minutes: 23}),

      },
      {
        user_id: 8,
        text: 'Nada melhor do que começar a semana com aquele treino matinal',
        imageUrl: 'https://imgur.com/21bEhjG.jpg',
        created_at: DateTime.now().minus({days: 2, minutes: 30}),
      },
      {
        user_id: 9,
        text: 'E aí, tem coragem de dormir aqui?',
        imageUrl: 'https://imgur.com/LiCP9fI.jpg',
        created_at: DateTime.now().minus({days: 3, minutes: 30}),
      },
      {
        user_id: 1,
        text: 'No coffee no code ☕️',
        imageUrl: 'https://imgur.com/jDMERlT.jpg',
        created_at: DateTime.now().minus({days: 3, hour: 1}),
      },
      {
        user_id: 3,
        text: 'Que noite! 🎉',
        imageUrl: 'https://i.imgur.com/oYSHOid.jpg',
        created_at: DateTime.now().minus({days: 3, hour: 4}),
      },
      {
        user_id: 6,
        text: 'Mais uma noite de muito código',
        imageUrl: 'https://i.imgur.com/7XGUCpo.jpg',
        created_at: DateTime.now().minus({weeks: 1}),
      },
      {
        user_id: 7,
        text: 'Good morning!',
        imageUrl: 'https://i.imgur.com/3sLreqX.jpg',
        created_at: DateTime.now().minus({weeks: 1, hour: 4}),
      },
    ])
  }
}