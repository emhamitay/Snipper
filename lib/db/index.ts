// בעה"י
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString: string = process.env.DATABASE_URL!;

const client = postgres(connectionString);

export const db = drizzle(client, { schema });

export { schema };