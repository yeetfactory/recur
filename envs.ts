import {z} from 'zod'
const Zod_EnvSchema = z.object({
    BRANDFETCH_CLIENT_ID: z.string(),
}) 

const envs = Zod_EnvSchema.parse(process.env);

const { BRANDFETCH_CLIENT_ID } = envs;

export { BRANDFETCH_CLIENT_ID };