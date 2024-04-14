import zod from 'zod';

const configSchema = zod.object({
  NODE_ENV: zod.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: zod.string(),
  JWT_SECRET: zod.string(),
  CLOUDINARY_CLOUD_NAME: zod.string(),
  CLOUDINARY_API_KEY: zod.string(),
  CLOUDINARY_API_SECRET: zod.string(),
  EMAILID: zod.string(),
  PASSWORD: zod.string(),
  SITEURL: zod.string().default('http://localhost:3000')
});

export const Config = configSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  EMAILID: process.env.EMAILID,
  PASSWORD: process.env.PASSWORD,
  SITEURL: process.env.SITEURL
});
