import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Schema = typeof schema;

let client: ReturnType<typeof postgres> | undefined;
let cached: PostgresJsDatabase<Schema> | undefined;

function getDb(): PostgresJsDatabase<Schema> {
  if (!cached) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL belum di-set. Salin .env.example ke .env.local lalu isi.");
    }
    client = postgres(connectionString, { prepare: false });
    cached = drizzle(client, { schema });
  }
  return cached;
}

/** Klien Drizzle lazy: aman di-import saat build tanpa env, error jelas saat query pertama. */
export const db: PostgresJsDatabase<Schema> = new Proxy({} as PostgresJsDatabase<Schema>, {
  get: (_target, prop) => (getDb() as unknown as Record<string, unknown>)[prop as string],
});

export type Db = PostgresJsDatabase<Schema>;

/** Tutup koneksi pool — WAJIB dipanggil di akhir skrip CLI agar proses exit. */
export async function closeDb(): Promise<void> {
  cached = undefined;
  await client?.end();
  client = undefined;
}
