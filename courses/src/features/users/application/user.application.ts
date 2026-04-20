import { ResultPage } from '@core/responses';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User, UserPropsUpdate } from '@users/domain';
import { type UserPort, UserUseCasePort } from '@users/ports';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class UserApplication implements UserUseCasePort {
  constructor(
    @Inject('USER_PORT') private readonly port: UserPort,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
    @InjectPinoLogger(UserApplication.name)
    private readonly logger: PinoLogger,
  ) {}

  async save(user: User, idempotencyKey: string | null | undefined) {
    if (idempotencyKey) {
      this.logger.info('Saving user with idempotency key: %s', idempotencyKey);
      const cached = await this.cacheManager.get<string>(idempotencyKey);

      if (cached) {
        this.logger.info(
          'Found cached user with idempotency key: %s',
          idempotencyKey,
        );
        return JSON.parse(cached);
      }

      this.logger.info(
        'No cached user found with idempotency key: %s, saving new user',
        idempotencyKey,
      );

      await this.port.save(user);

      const result = JSON.stringify(user.properties);
      const ttl = this.configService.get<number>('redis.ttl_idempotency');
      await this.cacheManager.set(idempotencyKey, result, ttl);

      this.logger.info(
        'User saved and cached with idempotency key: %s, ttl: %d seconds',
        idempotencyKey,
        ttl,
      );

      return result;
    }

    return await this.port.save(user);
  }

  async update(userId: number, props: UserPropsUpdate): Promise<void> {
    const user = await this.port.getById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    user.update(props);
    return this.port.save(user);
  }

  async delete(userId: number): Promise<void> {
    const user = await this.port.getById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.delete();
    return this.port.save(user);
  }

  getById(userId: number): Promise<User | null> {
    return this.port.getById(userId);
  }

  getByPage(page: number, pageSize: number): Promise<ResultPage<User>> {
    return this.port.getByPage(page, pageSize);
  }

  getByPageAndCursor(
    cursor: number | null,
    pageSize: number,
  ): Promise<ResultPage<User>> {
    return this.port.getByPageAndCursor(cursor, pageSize);
  }

  getAll(): Promise<User[]> {
    return this.port.getAll();
  }
}
