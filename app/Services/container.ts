import { container } from 'tsyringe';
import PostsRepository from 'App/Repositories/PostsRepository';

container.register('PostRepository', {
  useClass: PostsRepository,
});
