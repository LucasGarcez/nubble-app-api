import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import PostReaction from 'App/Models/PostReaction'

export default class PostReactionSeeder extends BaseSeeder {
  public async run() {
    await PostReaction.createMany(createPostReactions())
  }
}

function createPostReactions() {
  const postReactions:  Partial<PostReaction>[] = []
  for(let i = 0; i < 200; i++) {
    const user_id = Math.floor(Math.random() * 9) + 1
    const post_id = Math.floor(Math.random() * 24) + 1
    const emoji_type = Math.random() < 0.8 ? 'like' : 'favorite'
    postReactions.push({ user_id, post_id, emoji_type })
  }
  return postReactions
}
