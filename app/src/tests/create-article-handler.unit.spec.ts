import { plainToInstance } from 'class-transformer';
import { InternalServerError } from '../common/utils/result/custom-error';
import {
  CreateArticleHandler,
  CreateArticleCommand,
} from '../features/article/application/commands/create-article.command';
import { ArticleRepository } from '../features/article/repository/article.repository';
import { UserRepository } from '../features/user/repository/user.repository';
import { User } from '../features/user/domain/user.entity';
import { Article } from '../features/article/domain/article.entity';

describe('CreateArticleHandler', () => {
  let handler: CreateArticleHandler;
  let articleRepository: jest.Mocked<ArticleRepository>;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    articleRepository = {
      save: jest.fn(),
    } as any;

    userRepository = {
      findUserById: jest.fn(),
    } as any;

    handler = new CreateArticleHandler(articleRepository, userRepository);
  });

  it('should return error if user not found', async () => {
    userRepository.findUserById.mockResolvedValue(null);

    const command = new CreateArticleCommand({ title: 'Test Article', description: 'Some description' }, 'user-1');

    const result = await handler.execute(command);

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(InternalServerError);
  });

  it('should return error if articleRepository.save throws error', async () => {
    userRepository.findUserById.mockResolvedValue(
      plainToInstance(User, {
        id: '123',
        createdAt: new Date(),
        login: 'existinguser',
        passwordHash: 'hashed-password',
      }),
    );

    articleRepository.save.mockRejectedValue(new Error('DB error'));

    const command = new CreateArticleCommand({ title: 'Test Article', description: 'Some description' }, 'user-1');

    const result = await handler.execute(command);

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(InternalServerError);
  });

  it('should return success if article is created', async () => {
    const mockUser = plainToInstance(User, {
      id: '123',
      createdAt: new Date(),
      login: 'john',
      passwordHash: 'hashed-password',
    });
    const mockArticle = plainToInstance(Article, {
      title: 'Test Article',
      description: 'Some description',
      createdAt: new Date('2023-01-01T00:00:00.000Z'),
      user: mockUser,
    });

    userRepository.findUserById.mockResolvedValue(mockUser);
    articleRepository.save.mockResolvedValue(mockArticle);

    const command = new CreateArticleCommand({ title: 'Test Article', description: 'Some description' }, 'user-1');

    const result = await handler.execute(command);

    expect(result.isSuccess).toBe(true);
    expect(result.value).toEqual({
      title: 'Test Article',
      description: 'Some description',
      createdAt: '2023-01-01T00:00:00.000Z',
      authorName: 'john',
    });
  });
});
