import { ResultPage } from '@core/responses';
import { Role } from '@roles/domain';

export type RolePort = {
  getAll(): Promise<Role[]>;
  save(role: Role): Promise<void>;
  getById(roleId: number): Promise<Role | null>;
  getByPage(page: number, pageSize: number): Promise<ResultPage<Role>>;
  getByPageAndCursor(
    cursor: number | null,
    pageSize: number,
  ): Promise<ResultPage<Role>>;
};
