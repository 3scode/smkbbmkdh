/** Augmentasi minimal agar skrip CLI (dijalankan via `bun`) lolos `tsc --noEmit`. */
interface ImportMeta {
  main?: boolean;
}
