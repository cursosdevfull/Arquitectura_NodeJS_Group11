import { IsNotEmpty, MinLength } from 'class-validator';

export class UserHeadersDto {
  @IsNotEmpty()
  @MinLength(20)
  'x-idempotency': string;
}
