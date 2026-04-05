import { CourseEntity } from '@courses/adapters';
import { Course, CourseProps } from '@courses/domain';
import { plainToInstance } from 'class-transformer';

export function CourseDomainToData(
  domain: Course | Course[],
): CourseEntity | CourseEntity[] {
  if (Array.isArray(domain)) {
    return domain.map((course) => CourseDomainToData(course) as CourseEntity);
  }

  return plainToInstance(CourseEntity, domain.properties);
}

export function CourseDataToDomain(
  data: CourseEntity | CourseEntity[],
): Course | Course[] {
  if (Array.isArray(data)) {
    return data.map((course) => CourseDataToDomain(course) as Course);
  }

  const props: CourseProps = {
    courseId: data.courseId,
    name: data.name,
    isActive: data.isActive,
  };

  return new Course(props);
}
