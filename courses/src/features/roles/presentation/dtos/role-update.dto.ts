import { IsNotEmpty, MinLength } from 'class-validator';

export class RoleUpdateDto {
  @IsNotEmpty()
  @MinLength(3)
  name!: string;
}
