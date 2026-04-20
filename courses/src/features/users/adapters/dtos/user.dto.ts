import { UserEntity } from '@users/adapters';
import { User, UserProps } from '@users/domain';
import { plainToInstance } from 'class-transformer';

export function UserDomainToData(
  domain: User | User[],
): UserEntity | UserEntity[] {
  if (Array.isArray(domain)) {
    return domain.map((user) => UserDomainToData(user) as UserEntity);
  }

  return plainToInstance(UserEntity, domain.properties);
}

export function UserDataToDomain(
  data: UserEntity | UserEntity[],
): User | User[] {
  if (Array.isArray(data)) {
    return data.map((user) => UserDataToDomain(user) as User);
  }

  const props: UserProps = {
    userId: data.userId,
    name: data.name,
    email: data.email,
    roleId: data.roleId,
    isActive: data.isActive,
  };

  return new User(props);
}
