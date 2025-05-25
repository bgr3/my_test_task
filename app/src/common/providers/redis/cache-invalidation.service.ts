import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CacheInvalidationService {
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis();
  }

  async invalidateCacheByPrefix(prefix: string) {
    // Создаем поток для сканирования ключей в Redis, которые начинаются с указанного префикса
    const stream = this.redis.scanStream({
      match: `${prefix}*`, // шаблон для поиска ключей по префиксу
      count: 100, // количество ключей, обрабатываемых за итерацию (не гарантированное)
    });

    // Подписываемся на событие "data" — будет вызываться каждый раз, когда найдена порция ключей
    stream.on('data', (keys: string[]) => {
      if (keys.length > 0) {
        // Создаем пайплайн — позволяет отправить несколько команд Redis за один запрос
        const pipeline = this.redis.pipeline();

        // Для каждого найденного ключа добавляем команду удаления в пайплайн
        keys.forEach((key) => pipeline.del(key));

        // Выполняем все команды из пайплайна
        pipeline.exec();
      }
    });

    // Возвращаем промис, который завершится, когда поток полностью завершится или произойдет ошибка
    return new Promise<void>((resolve, reject) => {
      stream.on('end', () => resolve());
      stream.on('error', (err) => reject(err));
    });
  }
}
