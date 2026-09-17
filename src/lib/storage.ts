import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join, posix } from "node:path";
import { createClient } from "@supabase/supabase-js";

/**
 * Upload KK dengan 2 provider:
 * - `supabase` (production/Netlify): bucket privat `kk-docs`, akses via
 *   signed-URL. Butuh NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
 * - `local` (dev DDEV): simpan ke UPLOAD_DIR (default ./public/uploads/kk),
 *   kembalikan URL publik `/uploads/kk/...` yang diserve Next secara statis.
 *
 * Validasi: JPG/PDF, ≤ UPLOAD_MAX_MB (default 2MB) → 413 jika lewat.
 * Scan magic bytes (bukan cuma ekstensi/mime client).
 * Nama file acak (uuid).
 */

export const KK_BUCKET = "kk-docs";
const ALLOWED_MIME = ["image/jpeg", "application/pdf"] as const;

export type StorageProvider = "local" | "supabase";

export function storageProvider(): StorageProvider {
  return process.env.STORAGE_PROVIDER === "supabase" ? "supabase" : "local";
}

export function maxUploadBytes(): number {
  const mb = Number(process.env.UPLOAD_MAX_MB ?? 2);
  return (Number.isFinite(mb) && mb > 0 ? mb : 2) * 1024 * 1024;
}

export class UploadTooLargeError extends Error {
  constructor(maxMb: number) {
    super(`File maksimal ${maxMb}MB (JPG/PDF saja).`);
  }
}

export class InvalidFileError extends Error {
  constructor() {
    super("Format file salah — hanya JPG/PDF yang diterima.");
  }
}

function hasValidMagic(bytes: Uint8Array, mime: string): boolean {
  if (mime === "application/pdf") {
    return (
      bytes.length >= 5 &&
      bytes[0] === 0x25 && // %
      bytes[1] === 0x50 && // P
      bytes[2] === 0x44 && // D
      bytes[3] === 0x46 // F
    );
  }
  // image/jpeg: FF D8 FF
  return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
}

export interface ValidatedFile {
  bytes: Uint8Array;
  ext: "jpg" | "pdf";
}

export async function validateKkFile(file: File): Promise<ValidatedFile> {
  if (file.size > maxUploadBytes()) {
    throw new UploadTooLargeError(Number(process.env.UPLOAD_MAX_MB ?? 2));
  }
  const mime = file.type;
  if (!(ALLOWED_MIME as readonly string[]).includes(mime)) {
    throw new InvalidFileError();
  }
  const buffer = new Uint8Array(await file.arrayBuffer());
  if (!hasValidMagic(buffer, mime)) throw new InvalidFileError();
  return { bytes: buffer, ext: mime === "application/pdf" ? "pdf" : "jpg" };
}

function supabaseStorageClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase storage belum dikonfigurasi.");
  }
  return createClient(url, key);
}

async function uploadKkSupabase(bytes: Uint8Array, ext: string): Promise<string> {
  const path = `${new Date().getFullYear()}/${randomUUID()}.${ext}`;
  const { error } = await supabaseStorageClient()
    .storage.from(KK_BUCKET)
    .upload(path, bytes, {
      contentType: ext === "pdf" ? "application/pdf" : "image/jpeg",
      upsert: false,
    });
  if (error) throw new Error(`Upload gagal: ${error.message}`);
  return path;
}

async function uploadKkLocal(bytes: Uint8Array, ext: string): Promise<string> {
  const year = String(new Date().getFullYear());
  const baseDir = process.env.UPLOAD_DIR ?? "./public/uploads/kk";
  const dir = join(process.cwd(), baseDir, year);
  await mkdir(dir, { recursive: true });
  const filename = `${randomUUID()}.${ext}`;
  await writeFile(join(dir, filename), bytes);
  // URL publik — diserve Next dari /public. Selalu pakai slash POSIX.
  return posix.join("/uploads/kk", year, filename);
}

/**
 * Upload bytes tervalidasi → kembalikan path/URL privat.
 * - provider `supabase`: path bucket privat (`2026/<uuid>.pdf`).
 * - provider `local`: URL publik (`/uploads/kk/2026/<uuid>.pdf`).
 */
export async function uploadKk(bytes: Uint8Array, ext: string): Promise<string> {
  if (storageProvider() === "supabase") {
    return uploadKkSupabase(bytes, ext);
  }
  return uploadKkLocal(bytes, ext);
}

/** True jika nilai kkFileUrl adalah file lokal (bisa di-serve langsung). */
export function isLocalKkUrl(value: string | null | undefined): boolean {
  return !!value && value.startsWith("/uploads/kk/");
}
