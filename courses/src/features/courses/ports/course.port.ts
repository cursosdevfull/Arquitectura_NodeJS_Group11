import { ResultPage } from '@core/responses';
import { Course } from '@courses/domain';

export type CoursePort = {
  getAll(): Promise<Course[]>;
  save(course: Course): Promise<void>;
  getById(courseId: number): Promise<Course | null>;
  getByPage(page: number, pageSize: number): Promise<ResultPage<Course>>;
  getByPageAndCursor(
    cursor: number | null,
    pageSize: number,
  ): Promise<ResultPage<Course>>;
};
