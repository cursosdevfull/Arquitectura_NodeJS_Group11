import { ResultPage } from '@core/responses';
import { Course, CoursePropsUpdate } from '@courses/domain';
import { type CoursePort, CourseUseCasePort } from '@courses/ports';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CourseApplication implements CourseUseCasePort {
  constructor(@Inject('COURSE_PORT') private readonly port: CoursePort) {}

  save(course: Course): Promise<void> {
    return this.port.save(course);
  }

  async update(courseId: number, props: CoursePropsUpdate): Promise<void> {
    const course = await this.port.getById(courseId);

    if (!course) {
      throw new Error('Course not found');
    }

    course.update(props);
    return this.port.save(course);
  }

  async delete(courseId: number): Promise<void> {
    const course = await this.port.getById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    course.delete();
    return this.port.save(course);
  }

  getById(courseId: number): Promise<Course | null> {
    return this.port.getById(courseId);
  }

  getByPage(page: number, pageSize: number): Promise<ResultPage<Course>> {
    return this.port.getByPage(page, pageSize);
  }

  getByPageAndCursor(
    cursor: number | null,
    pageSize: number,
  ): Promise<ResultPage<Course>> {
    return this.port.getByPageAndCursor(cursor, pageSize);
  }

  getAll(): Promise<Course[]> {
    return this.port.getAll();
  }
}
