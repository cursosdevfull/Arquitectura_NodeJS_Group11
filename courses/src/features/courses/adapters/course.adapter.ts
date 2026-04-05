import { ResultPage } from '@core/responses';
import { CourseEntity } from '@courses/adapters/course.entity';
import { Course } from '@courses/domain';
import { CoursePort } from '@courses/ports';
import { Inject, Injectable } from '@nestjs/common';
import { MoreThan, Repository } from 'typeorm';
import { CourseDataToDomain, CourseDomainToData } from './dtos';

@Injectable()
export class CourseAdapter implements CoursePort {
  constructor(
    @Inject('COURSE_REPOSITORY')
    private readonly repository: Repository<CourseEntity>,
  ) {}

  async save(course: Course): Promise<void> {
    try {
      const courseEntity = CourseDomainToData(course) as CourseEntity;
      await this.repository.save(courseEntity);
    } catch (error) {
      throw new Error('Error saving course');
    }
  }

  async getById(courseId: number): Promise<Course | null> {
    try {
      const result = await this.repository.findOne({
        where: { courseId, isActive: true },
      });
      return result ? (CourseDataToDomain(result) as Course) : null;
    } catch (error) {
      throw new Error('Error fetching course by id');
    }
  }

  async getByPage(page: number, pageSize: number): Promise<ResultPage<Course>> {
    try {
      const [results, total] = await this.repository.findAndCount({
        where: { isActive: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });

      return {
        status: 200,
        data: results.map((result) => CourseDataToDomain(result) as Course),
        metadata: {
          total,
          currentPage: page,
          pageSize,
        },
      };
    } catch (error) {
      throw new Error('Error fetching courses by page');
    }
  }

  async getByPageAndCursor(
    cursor: number | null,
    pageSize: number,
  ): Promise<ResultPage<Course>> {
    try {
      const results = await this.repository.find({
        where: { courseId: MoreThan(cursor || 0), isActive: true },
        take: pageSize + 1,
        order: { courseId: 'ASC' },
      });

      const hasMore = results.length === pageSize + 1;

      const records = results.map(
        (result) => CourseDataToDomain(result) as Course,
      );

      return {
        status: 200,
        data: hasMore ? records.slice(0, -1) : records,
        metadata: {
          nextCursor: hasMore
            ? records[records.length - 2].properties.courseId
            : null,
          pageSize,
          hasMore,
        },
      };
    } catch (error) {
      throw new Error('Error fetching courses by page');
    }
  }

  async getAll(): Promise<Course[]> {
    try {
      const results = await this.repository.find({ where: { isActive: true } });
      return results.map(
        (result) =>
          new Course({
            courseId: result.courseId,
            name: result.name,
            isActive: result.isActive,
          }),
      );
    } catch (error) {
      throw new Error('Error fetching courses');
    }
  }
}
