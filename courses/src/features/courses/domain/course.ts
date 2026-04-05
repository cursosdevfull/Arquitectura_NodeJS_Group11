type CoursePropsRequired = {
  name: string;
};

type CoursePropsOptional = {
  courseId: number;
  isActive: boolean;
};

export type CourseProps = CoursePropsRequired & Partial<CoursePropsOptional>;
export type CoursePropsUpdate = CoursePropsRequired;

export class Course {
  private readonly courseId: number;
  private name: string;
  private isActive: boolean;

  constructor(props: CourseProps) {
    this.name = props.name;
    if (props.courseId) {
      this.courseId = props.courseId;
    }
    if (props.isActive !== undefined) {
      this.isActive = props.isActive;
    }
  }

  get properties(): CourseProps {
    return {
      courseId: this.courseId,
      name: this.name,
      isActive: this.isActive,
    };
  }

  update(props: CoursePropsUpdate) {
    this.name = props.name;
  }

  delete() {
    this.isActive = false;
  }
}
