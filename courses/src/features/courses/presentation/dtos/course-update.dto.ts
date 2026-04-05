import { IsNotEmpty, MinLength } from 'class-validator';

export class CourseUpdateDto {
  @IsNotEmpty()
  @MinLength(3)
  name: string;
}
