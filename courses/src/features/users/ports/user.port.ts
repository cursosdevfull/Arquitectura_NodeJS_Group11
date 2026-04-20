import { ResultPage } from '@core/responses';
import { User } from '@users/domain';

export type UserPort = {
  getAll(): Promise<User[]>;
  save(user: User): Promise<void>;
  getById(userId: number): Promise<User | null>;
  getByPage(page: number, pageSize: number): Promise<ResultPage<User>>;
  getByPageAndCursor(
    cursor: number | null,
    pageSize: number,
  ): Promise<ResultPage<User>>;
};
