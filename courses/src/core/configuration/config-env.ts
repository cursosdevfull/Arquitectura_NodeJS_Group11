import * as yaml from 'js-yaml';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';

const CONFIG_PATH = join(__dirname, '../../..', 'config.yml');

const schema = z.object({
  port: z.coerce.number(),
  database: z.object({
    host: z.string().min(3),
    port: z.coerce.number(),
    user: z.string().min(3),
    password: z.string().min(8),
    name: z.string().min(3),
    synchronize: z.coerce.boolean(),
    logging: z.coerce.boolean(),
  }),
  redis: z.object({
    host: z.string().min(3),
    port: z.coerce.number(),
    password: z.string().min(8),
    ttl_idempotency: z.coerce.number(),
  }),
});

export const configEnv = () => {
  const fileContents = readFileSync(CONFIG_PATH, 'utf8');

  const config = yaml.load(fileContents);
  return schema.parse(config);
};
