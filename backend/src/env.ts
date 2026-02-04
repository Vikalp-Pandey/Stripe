import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

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


  // Jwt Secret Keys
  ACCESS_SECRET:z.string(),
  // REFRESH_SECRET:z.string(),
  ACCESS_SECRET_TTL:z.string(),
  // REFRESH_SECRET_TTL:z.string(),


  // Stripe Api Keys
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_PUBLISHABLE_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET:z.string(),

  // Github OAuth Credentials
  GITHUB_CLIENT_ID:z.string(),
  GITHUB_CLIENT_SECRET:z.string(),
  GITHUB_REDIRECT_URI:z.string(),
  // Google OAuth Credentials
  GOOGLE_CLIENT_ID:z.string(),
  GOOGLE_CLIENT_SECRET:z.string(),
  GOOGLE_REDIRECT_URI:z.string()
  
});

const { data, success, error } = envSchema.safeParse(process.env);

if (!success || !data) {
  console.error(error);
  process.exit(1);
}

const env = data;

export default env;
