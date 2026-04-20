import { IsNotEmpty, MinLength } from 'class-validator';

export class RoleCreateDto {
  @IsNotEmpty()
  @MinLength(3)
  name!: string;
}
