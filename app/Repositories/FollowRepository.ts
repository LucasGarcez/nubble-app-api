import BaseRepository from 'App/Shared/Repositories/BaseRepository'
import { IFollow } from 'App/Interfaces/IFollow';
import Follow from 'App/Models/Follow';

export default class FollowRepository
  extends BaseRepository<typeof Follow>
  implements IFollow.Repository
{
  constructor() {
    super(Follow)
  }

  public async isFollowing(follower_user_id: number, followed_user_id: number): Promise<boolean> {

    if(follower_user_id === followed_user_id) return true

    return !!await this.orm.query()
    .where('follower_user_id', follower_user_id)
    .where('followed_user_id', followed_user_id)
    .first()
  }

}
