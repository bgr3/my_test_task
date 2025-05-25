import { plainToInstance } from 'class-transformer';
import { ForbiddenError, InternalServerError, NotFoundError } from '../common/utils/result/custom-error';
import {
  DeleteArticleHandler,
  DeleteArticleCommand,
} from '../features/article/application/commands/delete-article.command';
import { Article } from '../features/article/domain/article.entity';
import { ArticleRepository } from '../features/article/repository/article.repository';
import { User } from '../features/user/domain/user.entity';

describe('DeleteArticleHandler', () => {
  let handler: DeleteArticleHandler;
  let articleRepository: jest.Mocked<ArticleRepository>;

  const mockUser = plainToInstance(User, {
    id: '123',
    login: 'john',
    createdAt: new Date(),
    passwordHash: 'hashed-password',
  });

  beforeEach(() => {
    articleRepository = {
      getArticleById: jest.fn(),
      deleteArticleById: jest.fn(),
    } as any;

    handler = new DeleteArticleHandler(articleRepository);
  });

  it('should return error if article not found', async () => {
    articleRepository.getArticleById.mockResolvedValue(null);

    const command = new DeleteArticleCommand('article-id', '123');

    const result = await handler.execute(command);

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(NotFoundError);
  });

  it('should return error if user is not the author', async () => {
    const article = plainToInstance(Article, {
      id: 'article-id',
      title: 'Old Title',
      description: 'Old desc',
      createdAt: new Date('2023-01-01T00:00:00.000Z'),
      user: mockUser,
      userId: 'other-user-id',
    });

    articleRepository.getArticleById.mockResolvedValue(article);

    const command = new DeleteArticleCommand('article-id', '123');

    const result = await handler.execute(command);

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(ForbiddenError);
  });

  it('should return internal error if delete fails', async () => {
    const article = plainToInstance(Article, {
      id: 'article-id',
      title: 'Old Title',
      description: 'Old desc',
      createdAt: new Date(),
      user: mockUser,
      userId: '123',
    });

    articleRepository.getArticleById.mockResolvedValue(article);
    articleRepository.deleteArticleById.mockRejectedValue(new Error('DB error'));

    const command = new DeleteArticleCommand('article-id', '123');

    const result = await handler.execute(command);

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(InternalServerError);
  });

  it('should return success if article is deleted', async () => {
    const article = plainToInstance(Article, {
      id: 'article-id',
      title: 'Old Title',
      description: 'Old desc',
      createdAt: new Date(),
      user: mockUser,
      userId: '123',
    });

    articleRepository.getArticleById.mockResolvedValue(article);
    articleRepository.deleteArticleById.mockResolvedValue(undefined); // delete usually returns void

    const command = new DeleteArticleCommand('article-id', '123');

    const result = await handler.execute(command);

    expect(result.isSuccess).toBe(true);
    expect(result.value).toBe(true); // ObjResult.Ok() with no value
  });
});
