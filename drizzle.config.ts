import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// drizzle-kit CLI tidak otomatis load .env.local ala Next — load manual.
// Urutan: .env.local (dev) menimpa .env.
config({ path: ".env.local" });
config();

export default defineConfig({
  schema: "./src/lib/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
});
