import { IsNotEmpty, MinLength } from 'class-validator';

export class CourseHeadersDto {
  @IsNotEmpty()
  @MinLength(20)
  'x-idempotency': string;
}
