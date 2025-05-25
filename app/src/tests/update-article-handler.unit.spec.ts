import { plainToInstance } from 'class-transformer';
import { ForbiddenError, InternalServerError, NotFoundError } from '../common/utils/result/custom-error';
import {
  UpdateArticleHandler,
  UpdateArticleCommand,
} from '../features/article/application/commands/update-article.command';
import { Article } from '../features/article/domain/article.entity';
import { ArticleRepository } from '../features/article/repository/article.repository';
import { User } from '../features/user/domain/user.entity';

describe('UpdateArticleHandler', () => {
  let handler: UpdateArticleHandler;
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
      save: jest.fn(),
    } as any;

    handler = new UpdateArticleHandler(articleRepository);
  });

  it('should return error if article not found', async () => {
    articleRepository.getArticleById.mockResolvedValue(null);

    const command = new UpdateArticleCommand({ title: 'Updated', description: 'Updated desc' }, 'article-id', '123');

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
      userId: 'another-user-id',
    });

    articleRepository.getArticleById.mockResolvedValue(article);

    const command = new UpdateArticleCommand(
      { title: 'Updated', description: 'Updated desc' },
      'article-id',
      '123', // doesn't match article.userId
    );

    const result = await handler.execute(command);

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(ForbiddenError);
  });

  it('should return internal error if save throws', async () => {
    const article = plainToInstance(Article, {
      id: 'article-id',
      title: 'Old Title',
      description: 'Old desc',
      createdAt: new Date('2023-01-01T00:00:00.000Z'),
      user: mockUser,
      userId: '123',
      updateArticle: jest.fn(),
    });

    articleRepository.getArticleById.mockResolvedValue(article);
    articleRepository.save.mockRejectedValue(new Error('DB error'));

    const command = new UpdateArticleCommand({ title: 'Updated', description: 'Updated desc' }, 'article-id', '123');

    const result = await handler.execute(command);

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(InternalServerError);
  });

  it('should return success if article is updated', async () => {
    const article = plainToInstance(Article, {
      id: 'article-id',
      title: 'Old Title',
      description: 'Old desc',
      createdAt: new Date('2023-01-01T00:00:00.000Z'),
      user: mockUser,
      userId: '123',
    });

    const updatedArticle = plainToInstance(Article, {
      ...article,
      title: 'Updated',
      description: 'Updated desc',
      createdAt: new Date('2023-01-01T00:00:00.000Z'),
      user: mockUser,
    });

    articleRepository.getArticleById.mockResolvedValue(article);
    articleRepository.save.mockResolvedValue(updatedArticle);

    const command = new UpdateArticleCommand({ title: 'Updated', description: 'Updated desc' }, 'article-id', '123');

    const result = await handler.execute(command);

    expect(result.isSuccess).toBe(true);
    expect(result.value).toEqual({
      title: 'Updated',
      description: 'Updated desc',
      createdAt: '2023-01-01T00:00:00.000Z',
      authorName: 'john',
    });
  });
});
