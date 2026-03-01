import { Address } from "../entities/addres";
import { AgeVO } from "./value-objects/age.vo";

export class User {
    name: string;
    lastname: string;
    age: AgeVO
    hobbies: string[];
    books?: string[];
    email: string;
    address: Address

    constructor(name: string, lastname: string, age: number, hobbies: string[], email: string, address: Address, books?: string[]) {
        this.name = name;
        this.lastname = lastname;
        this.age = AgeVO.create(age);
        this.hobbies = hobbies;
        this.email = email;
        this.address = address;
    }
}