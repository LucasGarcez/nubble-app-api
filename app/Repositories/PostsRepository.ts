import BaseRepository from 'App/Shared/Repositories/BaseRepository'

import Post from 'App/Models/Post'
import { IPost } from 'App/Interfaces/IPost'

export default class PostRepository
  extends BaseRepository<typeof Post>
  implements IPost.Repository
{
  constructor() {
    super(Post)
  }
}
