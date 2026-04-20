import { ResultPage } from '@core/responses';
import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from '@users/adapters/user.entity';
import { User } from '@users/domain';
import { UserPort } from '@users/ports';
import { MoreThan, Repository } from 'typeorm';
import { UserDataToDomain, UserDomainToData } from './dtos';

@Injectable()
export class UserAdapter implements UserPort {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly repository: Repository<UserEntity>,
  ) {}

  async save(user: User): Promise<void> {
    try {
      const userEntity = UserDomainToData(user) as UserEntity;
      await this.repository.save(userEntity);
    } catch (error) {
      throw new Error('Error saving user');
    }
  }

  async getById(userId: number): Promise<User | null> {
    try {
      const result = await this.repository.findOne({
        where: { userId, isActive: true },
      });
      return result ? (UserDataToDomain(result) as User) : null;
    } catch (error) {
      throw new Error('Error fetching user by id');
    }
  }

  async getByPage(page: number, pageSize: number): Promise<ResultPage<User>> {
    try {
      const [results, total] = await this.repository.findAndCount({
        where: { isActive: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });

      return {
        status: 200,
        data: results.map((result) => UserDataToDomain(result) as User),
        metadata: {
          total,
          currentPage: page,
          pageSize,
        },
      };
    } catch (error) {
      throw new Error('Error fetching users by page');
    }
  }

  async getByPageAndCursor(
    cursor: number | null,
    pageSize: number,
  ): Promise<ResultPage<User>> {
    try {
      const results = await this.repository.find({
        where: { userId: MoreThan(cursor || 0), isActive: true },
        take: pageSize + 1,
        order: { userId: 'ASC' },
      });

      const hasMore = results.length === pageSize + 1;

      const records = results.map((result) => UserDataToDomain(result) as User);

      return {
        status: 200,
        data: hasMore ? records.slice(0, -1) : records,
        metadata: {
          nextCursor: hasMore
            ? records[records.length - 2].properties.userId
            : null,
          pageSize,
          hasMore,
        },
      };
    } catch (error) {
      throw new Error('Error fetching users by page');
    }
  }

  async getAll(): Promise<User[]> {
    try {
      const results = await this.repository.find({ where: { isActive: true } });
      return results.map(
        (result) =>
          new User({
            userId: result.userId,
            name: result.name,
            email: result.email,
            roleId: result.roleId,
            isActive: result.isActive,
          }),
      );
    } catch (error) {
      throw new Error('Error fetching users');
    }
  }
}
