import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import PostReaction from 'App/Models/PostReaction'

export default class PostReactionSeeder extends BaseSeeder {
  public async run() {
    await PostReaction.createMany(createPostReactions())
  }
}

function createPostReactions() {
  const postReactions:  Partial<PostReaction>[] = []
  const combinations = new Set();

  while (postReactions.length < 200) {
    const user_id = Math.floor(Math.random() * 9) + 1;
    const post_id = Math.floor(Math.random() * 24) + 1;
    const emoji_type = Math.random() < 0.8 ? 'like' : 'favorite';
    const reactionKey = `${user_id}-${post_id}-${emoji_type}`;

    if (!combinations.has(reactionKey)) {
      combinations.add(reactionKey);
      postReactions.push({ user_id, post_id, emoji_type });
    }
  }

  return postReactions;
}