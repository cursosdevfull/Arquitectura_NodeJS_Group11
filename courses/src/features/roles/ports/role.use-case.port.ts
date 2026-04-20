import { ResultPage } from '@core/responses';
import { Role, RolePropsUpdate } from '@roles/domain';

export type RoleUseCasePort = {
  getAll(): Promise<Role[]>;
  save(role: Role, idempotencyKey: string | null | undefined): Promise<string>;
  getById(roleId: number): Promise<Role | null>;
  getByPage(page: number, pageSize: number): Promise<ResultPage<Role>>;
  getByPageAndCursor(
    cursor: number | null,
    pageSize: number,
  ): Promise<ResultPage<Role>>;
  update(roleId: number, props: RolePropsUpdate): Promise<void>;
  delete(roleId: number): Promise<void>;
};
