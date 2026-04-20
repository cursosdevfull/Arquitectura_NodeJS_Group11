import { Type } from 'class-transformer';
import { IsEmail, IsNumber, IsOptional, Min, MinLength } from 'class-validator';

export class UserUpdateDto {
  @IsOptional()
  @MinLength(3)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  roleId?: number;
}
