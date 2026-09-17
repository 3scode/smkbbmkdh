import { readFileSync } from "node:fs";
import { join } from "node:path";

export interface ProfilContent {
  visi: string;
  misi: string[];
  tujuan: string[];
  sejarah: string[];
  kepsek: {
    nama: string;
    foto: string | null;
    sambutan: string[];
  };
}

/**
 * Fallback hardcoded verbatim — tampil jika content/profil.json hilang/rusak.
 * Sama dengan isi awal profil.json (draf UVP+PRD, menunggu pengesahan kepsek).
 */
export const PROFIL_FALLBACK: ProfilContent = {
  visi: "Terwujudnya lulusan SMK yang mandiri, berahlak mulia, terampil, berjiwa wirausaha, dan berdaya saing di pasar kerja lokal maupun global.",
  misi: [
    "Menanamkan keimanan dan ahlak mulia sebagai fondasi seluruh kegiatan pendidikan.",
    "Menyelenggarakan pendidikan kejuruan yang terampil dan sesuai kebutuhan dunia kerja.",
    "Menumbuhkan jiwa kewirausahaan dan kemandirian ekonomi pada setiap peserta didik.",
    "Mengembangkan kepemimpinan, kedisiplinan, dan tanggung jawab melalui pembiasaan dan organisasi kesiswaan.",
    "Membekali peserta didik dengan bahasa Inggris dan bahasa asing sebagai nilai tambah global.",
    "Mengawal bakat seni dan olahraga peserta didik hingga berkembang secara profesional.",
    "Menjalin kemitraan dengan dunia usaha dan dunia industri (DUDI) untuk penyerapan lulusan dan pembelajaran berbasis industri.",
  ],
  tujuan: [
    "Menghasilkan lulusan yang beriman, bertakwa, dan berakhlak mulia dalam kehidupan sehari-hari.",
    "Menghasilkan lulusan yang menguasai kompetensi kejuruan dan siap memasuki dunia kerja.",
    "Menghasilkan lulusan yang mampu menciptakan lapangan kerja melalui wirausaha mandiri.",
    "Menghasilkan lulusan yang berjiwa kepemimpinan dan bersemangat belajar sepanjang hayat.",
    "Menghasilkan lulusan yang mampu berkomunikasi dalam bahasa Inggris untuk peluang lokal dan global.",
    "Menyalurkan potensi seni dan olahraga peserta didik hingga berprestasi.",
    "Mewujudkan layanan pendidikan yang terjangkau dan transparan sesuai Standar Nasional Pendidikan.",
  ],
  sejarah: [
    "SMK Bangun Bangsa Mandiri (SMK BBM) Kandanghaur adalah sekolah menengah kejuruan swasta di Jl. PU Kemped No.212, Kandanghaur, Indramayu (NPSN 20233754).",
    "Dengan semboyan Mandiri Berahlak, Terampil Berwirausaha, sekolah memadukan penguatan keimanan, keterampilan vokasi, kewirausahaan, kepemimpinan, dan bahasa asing.",
  ],
  kepsek: {
    nama: "(Nama Kepala Sekolah — dilengkapi sekolah)",
    foto: null,
    sambutan: [
      "Assalamualaikum warahmatullahi wabarakatuh. Selamat datang di website resmi SMK Bangun Bangsa Mandiri Kandanghaur.",
      "Kami berkomitmen mendidik putra-putri Ayah/Bunda menjadi lulusan yang mandiri, berahlak mulia, dan terampil. Wassalamualaikum warahmatullahi wabarakatuh.",
    ],
  },
};

function isValidProfil(data: unknown): data is ProfilContent {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.visi === "string" &&
    Array.isArray(d.misi) &&
    d.misi.length > 0 &&
    Array.isArray(d.tujuan) &&
    d.tujuan.length > 0
  );
}

/** Baca content/profil.json (Decap CMS). Gagal → fallback + flag untuk banner. */
export function loadProfil(): { content: ProfilContent; fromFallback: boolean } {
  try {
    const raw = readFileSync(join(process.cwd(), "content", "profil.json"), "utf-8");
    const data: unknown = JSON.parse(raw);
    if (isValidProfil(data)) return { content: data, fromFallback: false };
    return { content: PROFIL_FALLBACK, fromFallback: true };
  } catch {
    return { content: PROFIL_FALLBACK, fromFallback: true };
  }
}
