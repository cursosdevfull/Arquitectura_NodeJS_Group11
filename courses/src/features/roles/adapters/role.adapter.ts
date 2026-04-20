import { ResultPage } from '@core/responses';
import { Inject, Injectable } from '@nestjs/common';
import { RoleEntity } from '@roles/adapters/role.entity';
import { Role } from '@roles/domain';
import { RolePort } from '@roles/ports';
import { MoreThan, Repository } from 'typeorm';
import { RoleDataToDomain, RoleDomainToData } from './dtos';

@Injectable()
export class RoleAdapter implements RolePort {
  constructor(
    @Inject('ROLE_REPOSITORY')
    private readonly repository: Repository<RoleEntity>,
  ) {}

  async save(role: Role): Promise<void> {
    try {
      const roleEntity = RoleDomainToData(role) as RoleEntity;
      await this.repository.save(roleEntity);
    } catch (error) {
      throw new Error('Error saving role');
    }
  }

  async getById(roleId: number): Promise<Role | null> {
    try {
      const result = await this.repository.findOne({
        where: { roleId, isActive: true },
      });
      return result ? (RoleDataToDomain(result) as Role) : null;
    } catch (error) {
      throw new Error('Error fetching role by id');
    }
  }

  async getByPage(page: number, pageSize: number): Promise<ResultPage<Role>> {
    try {
      const [results, total] = await this.repository.findAndCount({
        where: { isActive: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });

      return {
        status: 200,
        data: results.map((result) => RoleDataToDomain(result) as Role),
        metadata: {
          total,
          currentPage: page,
          pageSize,
        },
      };
    } catch (error) {
      throw new Error('Error fetching roles by page');
    }
  }

  async getByPageAndCursor(
    cursor: number | null,
    pageSize: number,
  ): Promise<ResultPage<Role>> {
    try {
      const results = await this.repository.find({
        where: { roleId: MoreThan(cursor || 0), isActive: true },
        take: pageSize + 1,
        order: { roleId: 'ASC' },
      });

      const hasMore = results.length === pageSize + 1;

      const records = results.map((result) => RoleDataToDomain(result) as Role);

      return {
        status: 200,
        data: hasMore ? records.slice(0, -1) : records,
        metadata: {
          nextCursor: hasMore
            ? records[records.length - 2].properties.roleId
            : null,
          pageSize,
          hasMore,
        },
      };
    } catch (error) {
      throw new Error('Error fetching roles by page');
    }
  }

  async getAll(): Promise<Role[]> {
    try {
      const results = await this.repository.find({ where: { isActive: true } });
      return results.map(
        (result) =>
          new Role({
            roleId: result.roleId,
            name: result.name,
            isActive: result.isActive,
          }),
      );
    } catch (error) {
      throw new Error('Error fetching roles');
    }
  }
}
