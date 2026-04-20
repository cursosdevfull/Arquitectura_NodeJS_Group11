import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber, Min, MinLength } from 'class-validator';

export class UserCreateDto {
  @IsNotEmpty()
  @MinLength(3)
  name!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  roleId!: number;
}
