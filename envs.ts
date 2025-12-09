import { z } from 'zod';

const Zod_EnvSchema = z.object({
    EXPO_PUBLIC_BRANDFETCH_CLIENT_ID: z.string().optional().default(''),
})

const envs = Zod_EnvSchema.parse(process.env);

// Export as strict string
const BRANDFETCH_CLIENT_ID = envs.EXPO_PUBLIC_BRANDFETCH_CLIENT_ID;

export { BRANDFETCH_CLIENT_ID };