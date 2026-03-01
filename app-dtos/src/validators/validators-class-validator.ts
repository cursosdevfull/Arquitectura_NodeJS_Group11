import { Optional } from "@nestjs/common"
import { Type } from "class-transformer"
import { ArrayMinSize, IsArray, IsEmail, IsNotEmpty, IsNumber, IsString, Min, MinLength, ValidateNested } from "class-validator"
import { type Request } from "express"

export class AddressDto {
    @IsNotEmpty({message: "Street is required"})
    street: string

    @IsNotEmpty({message: "City is required"})
    city: string

    @IsNotEmpty({message: "Number is required"})
    @Min(0, {message: "Number must be a positive number"})
    number: number
}

export class UserDto {
    @IsNotEmpty({message: "Name is required"})
    @MinLength(3, {message: "Name must be at least 3 characters"})
    name: string

    @IsNotEmpty({message: "Lastname is required"})
    @MinLength(3, {message: "Lastname must be at least 3 characters"})
    lastname: string

    @IsNotEmpty({message: "Age is required"})
    @Min(0, {message: "Age must be a positive number"})
    age: number

    @IsNotEmpty({message: "Hobbies is required"})
    @IsArray({message: "Hobbies must be an array"})
    @ArrayMinSize(1, {message: "Hobbies must have at least 1 item"})
    hobbies: string[]

    @Optional()
    @IsArray({message: "Books must be an array"})
    @ArrayMinSize(1, {message: "Books must have at least 1 item"})
    books?: string[]

    @IsNotEmpty({message: "Email is required"})
    @IsEmail({}, {message: "Email must be a valid email address"})
    email: string
    
    @IsNotEmpty({message: "Address is required"})
    @ValidateNested()
    @Type(() => AddressDto)
    address: AddressDto
}

export const validateUserByClassValidator = (req: Request) => {

}

// Función para extraer todos los mensajes de constraints de una estructura de validación
export function extractValidationMessages(validationErrors: any[]): string[] {
  const messages: string[] = [];
  
  function processItem(item: any) {
    // Si el item tiene constraints, extraer todos los mensajes
    if (item.constraints) {
      Object.values(item.constraints).forEach((message: any) => {
        if (typeof message === 'string') {
          messages.push(message);
        }
      });
    }
    
    // Si el item tiene children, procesarlos recursivamente
    if (item.children && Array.isArray(item.children)) {
      item.children.forEach((child: any) => {
        processItem(child);
      });
    }
  }
  
  // Procesar cada item del array principal
  validationErrors.forEach(item => {
    processItem(item);
  });
  
  return messages;
}

export class UserIdDto {
    @IsNotEmpty({message: "Id is required"})
    @IsNumber({}, {message: "Id must be a number"})
    @Min(0, {message: "Id must be a positive number"})
    @Type(() => Number)
    id: number
}

export class UserQueryStringDto {
    @Optional()
    @IsString({message: "Category must be a string"})
    @MinLength(3, {message: "Category must be at least 3 characters"})
    category: string
}