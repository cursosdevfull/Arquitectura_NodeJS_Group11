import { Expose, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class AddressDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  street: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  city: string;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  number: number;
}
