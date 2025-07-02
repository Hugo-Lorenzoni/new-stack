import { z } from "zod";

const EnvSchema = z.object({
  MINIO_BUCKET_NAME: z.string(),
  MINIO_ACCESS_KEY: z.string(),
  MINIO_SECRET_KEY: z.string(),
  MINIO_ENDPOINT: z.string(),
  MINIO_PORT: z.string(),
  MINIO_USE_SSL: z.string(),
});

EnvSchema.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof EnvSchema> {}
  }
}
