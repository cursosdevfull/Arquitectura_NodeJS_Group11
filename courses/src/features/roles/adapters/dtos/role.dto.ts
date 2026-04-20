import { RoleEntity } from '@roles/adapters';
import { Role, RoleProps } from '@roles/domain';
import { plainToInstance } from 'class-transformer';

export function RoleDomainToData(
  domain: Role | Role[],
): RoleEntity | RoleEntity[] {
  if (Array.isArray(domain)) {
    return domain.map((role) => RoleDomainToData(role) as RoleEntity);
  }

  return plainToInstance(RoleEntity, domain.properties);
}

export function RoleDataToDomain(
  data: RoleEntity | RoleEntity[],
): Role | Role[] {
  if (Array.isArray(data)) {
    return data.map((role) => RoleDataToDomain(role) as Role);
  }

  const props: RoleProps = {
    roleId: data.roleId,
    name: data.name,
    isActive: data.isActive,
  };

  return new Role(props);
}
