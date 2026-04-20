import { IsNotEmpty, MinLength } from 'class-validator';

export class RoleHeadersDto {
  @IsNotEmpty()
  @MinLength(20)
  'x-idempotency': string;
}
