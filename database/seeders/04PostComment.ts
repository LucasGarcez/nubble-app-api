import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import PostComment from 'App/Models/PostComment'
import { faker } from '@faker-js/faker';
import {subDays, formatISO} from 'date-fns'
import { DateTime } from 'luxon'

export default class PostCommentSeeder extends BaseSeeder {



  public async run() {
    await PostComment.createMany(createPostComments())
  }
}


function createPostComments() {
  const postComments:  Partial<PostComment>[] = []   

  //TODO: add createAt and updateAt
  for(let i = 0; i < 100; i++) {
    const user_id = Math.floor(Math.random() * 9) + 1
    const post_id = Math.floor(Math.random() * 24) + 1
    const message = faker.lorem.sentence({min: 3, max: 10})
    postComments.push({ user_id, post_id, message,  created_at: DateTime.fromISO(getRandomDate()) })
  }

  for(let i = 0; i < 17; i++) {
    const user_id = Math.floor(Math.random() * 9) + 1
    const post_id = 1
    const message = faker.lorem.sentence({min: 3, max: 10})
    postComments.push({ user_id, post_id, message, created_at: DateTime.fromISO(getRandomDate()) })
  }
  return postComments
}

function getRandomDate():string {
  const now = new Date()
  const lastTwoWeeks = subDays(now, 14)
  const date = faker.date.between({from: lastTwoWeeks, to: now})
  return formatISO(date)
}