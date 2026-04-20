type RolePropsRequired = {
  name: string;
};

type RolePropsOptional = {
  roleId: number;
  isActive: boolean;
};

export type RoleProps = RolePropsRequired & Partial<RolePropsOptional>;
export type RolePropsUpdate = RolePropsRequired;

export class Role {
  private readonly roleId!: number;
  private name: string;
  private isActive!: boolean;

  constructor(props: RoleProps) {
    this.name = props.name;
    if (props.roleId) {
      this.roleId = props.roleId;
    }
    if (props.isActive !== undefined) {
      this.isActive = props.isActive;
    }
  }

  get properties(): RoleProps {
    return {
      roleId: this.roleId,
      name: this.name,
      isActive: this.isActive,
    };
  }

  update(props: RolePropsUpdate) {
    this.name = props.name;
  }

  delete() {
    this.isActive = false;
  }
}
