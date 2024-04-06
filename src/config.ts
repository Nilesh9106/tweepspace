import zod from 'zod';

const configSchema = zod.object({
  NODE_ENV: zod.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: zod.string(),
  JWT_SECRET: zod.string()
});

export const Config = configSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET
});
