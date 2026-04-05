import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CoursePageV2Dto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  cursor: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  pageSize: number;
}
