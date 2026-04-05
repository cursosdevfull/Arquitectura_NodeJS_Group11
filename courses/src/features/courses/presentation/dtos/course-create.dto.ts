import { IsNotEmpty, MinLength } from 'class-validator';

export class CourseCreateDto {
  @IsNotEmpty()
  @MinLength(3)
  name: string;
}
