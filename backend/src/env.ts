import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local', quiet: true });

const envSchema = z.object({
  // Node Environment
  NODE_ENV: z
    .enum(['development', 'staging', 'production'])
    .default('development'),
    
  BASE_BACKEND_URL:z.string(),

  // Application
  ALLOWED_ORIGINS: z
    .string()
    .transform((val) => val.split(',').map((origin) => origin.trim())),

  // Database
  DATABASE_URL: z.string(),

  // Port
  PORT: z
    .string()
    .default('5000')
    .transform((val) => parseInt(val, 10)),


  // Stripe Api Keys
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_PUBLISHABLE_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET:z.string(),
});

const { data, success, error } = envSchema.safeParse(process.env);

if (!success || !data) {
  console.error(error);
  process.exit(1);
}

const env = data;

export default env;
