import { Type } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Min,
    MinLength,
    ValidateNested,
} from 'class-validator';
import { AddressDto } from './addres.dto';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  lastname: string;

  @IsNotEmpty()
  @IsNumber()
  //@Min(1)
  @Type(() => Number)
  age: number;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  hobbies: string[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  books?: string[];

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}
