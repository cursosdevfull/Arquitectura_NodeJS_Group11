import { z } from 'zod';

const envSchema = z.object({
    PORT: z.coerce.number(),
    DB_HOST: z.string(),
    DB_PORT: z.coerce.number(),
    DB_USER: z.string(),
})

export type Env = z.infer<typeof envSchema>;

export const config = () => {
    return envSchema.parse(process.env);
    /* if(isNaN(Number(process.env.PORT))) {
        throw new Error('PORT must be a number');
    }

    return {
        port: Number(process.env.PORT) || 3000,
        dbUser: process.env.DB_USER || 'default_user',
    } */
}