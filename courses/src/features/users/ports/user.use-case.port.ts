import { ResultPage } from '@core/responses';
import { User, UserPropsUpdate } from '@users/domain';

export type UserUseCasePort = {
  getAll(): Promise<User[]>;
  save(user: User, idempotencyKey: string | null | undefined): Promise<string>;
  getById(userId: number): Promise<User | null>;
  getByPage(page: number, pageSize: number): Promise<ResultPage<User>>;
  getByPageAndCursor(
    cursor: number | null,
    pageSize: number,
  ): Promise<ResultPage<User>>;
  update(userId: number, props: UserPropsUpdate): Promise<void>;
  delete(userId: number): Promise<void>;
};
