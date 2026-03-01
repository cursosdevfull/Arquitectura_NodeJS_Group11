import { Request } from "express";

type ValidationItemResult = {
    valid: boolean;
    message: string;
    status: number
}

type ValidationResult = ValidationItemResult[]

export const validateUser = (req: Request): ValidationResult => {
    const {name, lastname, age, hobbies, books, address, email} = req.body

    const result: ValidationResult = []

    if(!name) result.push({ valid: false, message: "Name is required", status: 400 })
    if(!lastname) result.push({ valid: false, message: "Lastname is required", status: 400 })
    if(!age) result.push({ valid: false, message: "Age is required", status: 400 })

    if(name && name.length < 3) result.push({ valid: false, message: "Name must be at least 3 characters", status: 400 })
    if(lastname && lastname.length < 3) result.push({ valid: false, message: "Lastname must be at least 3 characters", status: 400 })
    if(age && age < 0) result.push({ valid: false, message: "Age must be a positive number", status: 400 })

    if(!hobbies) result.push({ valid: false, message: "Hobbies is required", status: 400 })
    if(hobbies && !Array.isArray(hobbies)) result.push({ valid: false, message: "Hobbies must be an array", status: 400 })
    if(hobbies && hobbies.length < 1) result.push({ valid: false, message: "Hobbies must have at least 1 item", status: 400 })

    if(books && !Array.isArray(books)) result.push({ valid: false, message: "Books must be an array", status: 400 })
    if(books && books.length < 1) result.push({ valid: false, message: "Books must have at least 1 item", status: 400 })

    if(!address) result.push({ valid: false, message: "Address is required", status: 400 })
    if(address && typeof address !== "object") result.push({ valid: false, message: "Address must be an object", status: 400 })
    if(address && (!address.street || !address.city || !address.number)) result.push({ valid: false, message: "Address must have street, city, and number", status: 400 })

    if(!email) result.push({ valid: false, message: "Email is required", status: 400 })
    if(email && !/^\S+@\S+\.\S+$/.test(email)) result.push({ valid: false, message: "Email must be a valid email address", status: 400 })

    return result
}