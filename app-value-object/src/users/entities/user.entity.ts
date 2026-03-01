import { Address } from './addres';

export class User {
  name: string;
  lastname: string;
  age: number;
  hobbies: string[];
  books?: string[];
  email: string;
  address: Address;
}
