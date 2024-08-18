import { injectable, inject } from 'tsyringe'
import { IFollow } from 'App/Interfaces/IFollow'
import Follow from 'App/Models/Follow';
import { PaginateContractType } from 'App/Shared/Interfaces/BaseInterface'
import NotFoundException from 'App/Shared/Exceptions/NotFoundException'

import DTOs = IFollow.DTOs

@injectable()
export default class FollowServices {
  constructor(
    @inject('FollowRepository')
    private followRepository: IFollow.Repository
  ) {}

  public async listFollowing({
    page = 1,
    perPage = 10,
    userId = 0
  }: DTOs.ListFollower): Promise<PaginateContractType<typeof Follow>> {
    return this.followRepository.listWithPagination({
      page,
      perPage,
      scopes: (scopes) => {
        scopes.loadFollower(userId)
      },
    })
  }

  public async listFollower({
    page = 1,
    perPage = 10,
    userId = 0
  }: DTOs.ListFollowed): Promise<PaginateContractType<typeof Follow>> {
    return this.followRepository.listWithPagination({
      page,
      perPage,
      scopes: (scopes) => {
        scopes.loadFollowed(userId)
      },
    })
  }

  public async isFollowing(data: DTOs.Store): Promise<boolean> {
    const { ...followDto } = data

    return this.followRepository.isFollowing(
       Number(followDto.follower_user_id),
      Number(followDto.followed_user_id)
  )}

  public async store(data: DTOs.Store): Promise<Follow> {
    const { ...followDto } = data

    const follow = await this.followRepository.store(followDto)

    await follow.load('followed', (builder) => {
      builder.select(['id', 'first_name', 'last_name', 'username', 'email', 'profile_url', 'is_online'])
    })

    return follow.refresh()
  }

  public async delete(data: DTOs.Delete): Promise<void> {
    const { ...followDto } = data

    const follow = await this.followRepository.findBy('id', Number(followDto.id))

    if (follow?.follower_user_id !== followDto.follower_user_id) throw new NotFoundException('User not found or not available.')

    if (!follow) throw new NotFoundException('User not found or not available.')

    await follow.delete()
  }
}
