import { type Request } from "express"
import { z } from "zod"

const schema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    lastname: z.string().min(3, "Lastname must be at least 3 characters"),
    age: z.number().positive("Age must be a positive number"),
    hobbies: z.array(z.string()).min(1, "Hobbies must have at least 1 item"),
    books: z.array(z.string()).min(1, "Books must have at least 1 item").optional(),
    email: z.string().email("Email must be a valid email address"),
    address: z.object({
        street: z.string(),
        city: z.string(),
        number: z.number()
    })
})

export type ParameterUser = z.infer<typeof schema>

export const validateUserZod = (req: Request) => {
    const result = schema.safeParse(req.body)
    return result
}