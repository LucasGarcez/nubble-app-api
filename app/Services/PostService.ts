import 'App/Services/container'
import { injectable, inject } from 'tsyringe';
import { DateTime } from 'luxon';

import { PaginateContractType } from 'App/Shared/Interfaces/BaseInterface';
import NotFoundException from 'App/Shared/Exceptions/NotFoundException';
import DTOs = IPost.DTO;
import { IPost } from 'App/Interfaces/IPost';
import Post from 'App/Models/Post';

@injectable()
export default class PostServices {
  constructor(
    @inject('PostRepository')
    private postRepository: IPost.Repository
  ) { }

  public async list({
    page = 1,
    perPage = 10,
    search,
    userId = 0,
    authorId
  }: DTOs.List & {authorId?: number}): Promise<PaginateContractType<typeof Post>> {

    return this.postRepository.listWithPagination({
      page,
      perPage,
      orders: [{ column: 'created_at', direction: 'desc' }],
      scopes: (scopes) => {
        scopes.searchQueryScope(search);
        scopes.loadUser()
        scopes.reactionCount(userId)
        scopes.commentCount()
        if (authorId) {
          scopes.authorIdScope(authorId);
        }
      },
    });
  }

  public async get(id: string, userId: number): Promise<Post> {
    const post = await this.postRepository.findBy(
      'id',
      id,
      {
        scopes: (scopes) => {
          scopes.loadUser()
          scopes.reactionCount(userId)
          scopes.commentCount()
        },
      }
      );
    if (!post) throw new NotFoundException('Post not found or not available.');
    return post;
  }

  public async store(data: DTOs.Store, image: any): Promise<Post> {
    const { ...postDto } = data;

    const post = await this.postRepository.store(postDto);

    if (image) {
      await this.editImage(post, image)
    }

    await post.load('user');

    return post.refresh();
  }

  public async edit(id: string, data: any, image: any): Promise<Post> {
    const post = await this.postRepository.findBy('id', id);
    if (!post) throw new NotFoundException('Post not found or not available.');

    const { ...postDto } = data;

    post.merge(postDto);

    await this.postRepository.save(post);

    if (image) {
      await this.editImage(post, image)
    }

    return post.refresh();
  }

  public async editImage(post: Post, image: any): Promise<void> {

    const localSave = `uploads/posts/${post.id}/${Date.now()}.${image.imageCover.extname}`

    if(post.imageUrl) {
      await this.postRepository.deleteImage(post.imageUrl)
    }

    const postImage = await this.postRepository.uploadImage(localSave, image.imageCover)

    post.merge({
      imageUrl: postImage
    });

    await this.postRepository.save(post);
  }

  public async delete(id: string): Promise<void> {
    const post = await this.postRepository.findBy('id', id);
    if (!post) throw new NotFoundException('Post not found or not available.');

    post.merge({
      is_deleted: true,
      deleted_at: DateTime.now(),
    });
    await this.postRepository.save(post);
  }
}
