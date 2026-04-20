type UserPropsRequired = {
  name: string;
  email: string;
  roleId: number;
};

type UserPropsOptional = {
  userId: number;
  isActive: boolean;
};

export type UserProps = UserPropsRequired & Partial<UserPropsOptional>;
export type UserPropsUpdate = Partial<UserPropsRequired>;

export class User {
  private readonly userId!: number;
  private name: string;
  private email: string;
  private roleId: number;
  private isActive!: boolean;

  constructor(props: UserProps) {
    this.name = props.name;
    this.email = props.email;
    this.roleId = props.roleId;
    if (props.userId) {
      this.userId = props.userId;
    }
    if (props.isActive !== undefined) {
      this.isActive = props.isActive;
    }
  }

  get properties(): UserProps {
    return {
      userId: this.userId,
      name: this.name,
      email: this.email,
      roleId: this.roleId,
      isActive: this.isActive,
    };
  }

  update(props: UserPropsUpdate) {
    if (props.name) this.name = props.name;
    if (props.email) this.email = props.email;
    if (props.roleId) this.roleId = props.roleId;
  }

  delete() {
    this.isActive = false;
  }
}
