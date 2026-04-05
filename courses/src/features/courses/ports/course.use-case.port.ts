import { ResultPage } from '@core/responses';
import { Course, CoursePropsUpdate } from '@courses/domain';

export type CourseUseCasePort = {
  getAll(): Promise<Course[]>;
  save(course: Course): Promise<void>;
  getById(courseId: number): Promise<Course | null>;
  getByPage(page: number, pageSize: number): Promise<ResultPage<Course>>;
  getByPageAndCursor(
    cursor: number | null,
    pageSize: number,
  ): Promise<ResultPage<Course>>;
  update(courseId: number, props: CoursePropsUpdate): Promise<void>;
  delete(courseId: number): Promise<void>;
};
