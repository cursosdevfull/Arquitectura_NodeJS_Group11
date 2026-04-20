import { ResultPage } from '@core/responses';
import { Role, RolePropsUpdate } from '@roles/domain';
import { type RolePort, RoleUseCasePort } from '@roles/ports';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class RoleApplication implements RoleUseCasePort {
  constructor(
    @Inject('ROLE_PORT') private readonly port: RolePort,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
    @InjectPinoLogger(RoleApplication.name)
    private readonly logger: PinoLogger,
  ) {}

  async save(role: Role, idempotencyKey: string | null | undefined) {
    if (idempotencyKey) {
      this.logger.info('Saving role with idempotency key: %s', idempotencyKey);
      const cached = await this.cacheManager.get<string>(idempotencyKey);

      if (cached) {
        this.logger.info(
          'Found cached role with idempotency key: %s',
          idempotencyKey,
        );
        return JSON.parse(cached);
      }

      this.logger.info(
        'No cached role found with idempotency key: %s, saving new role',
        idempotencyKey,
      );

      await this.port.save(role);

      const result = JSON.stringify(role.properties);
      const ttl = this.configService.get<number>('redis.ttl_idempotency');
      await this.cacheManager.set(idempotencyKey, result, ttl);

      this.logger.info(
        'Role saved and cached with idempotency key: %s, ttl: %d seconds',
        idempotencyKey,
        ttl,
      );

      return result;
    }

    return await this.port.save(role);
  }

  async update(roleId: number, props: RolePropsUpdate): Promise<void> {
    const role = await this.port.getById(roleId);

    if (!role) {
      throw new Error('Role not found');
    }

    role.update(props);
    return this.port.save(role);
  }

  async delete(roleId: number): Promise<void> {
    const role = await this.port.getById(roleId);
    if (!role) {
      throw new Error('Role not found');
    }

    role.delete();
    return this.port.save(role);
  }

  getById(roleId: number): Promise<Role | null> {
    return this.port.getById(roleId);
  }

  getByPage(page: number, pageSize: number): Promise<ResultPage<Role>> {
    return this.port.getByPage(page, pageSize);
  }

  getByPageAndCursor(
    cursor: number | null,
    pageSize: number,
  ): Promise<ResultPage<Role>> {
    return this.port.getByPageAndCursor(cursor, pageSize);
  }

  getAll(): Promise<Role[]> {
    return this.port.getAll();
  }
}
