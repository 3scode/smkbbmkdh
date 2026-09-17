import Link from "next/link";
import { GraduationCap, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { NAV_LINKS, SCHOOL, waLink, WA_TANYA } from "@/lib/constants";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "./SocialIcons";

const JURUSAN_LINKS = [
  { label: "Teknik Komputer & Jaringan", href: "/jurusan/tkj" },
  { label: "Teknik Kendaraan Ringan", href: "/jurusan/tkr" },
  { label: "Akuntansi", href: "/jurusan/akl" },
  { label: "Manajemen Perkantoran", href: "/jurusan/mplb" },
];

const SOCIALS = [
  { label: "Facebook SMK BBM", href: "#", Icon: FacebookIcon },
  { label: "Instagram SMK BBM", href: "#", Icon: InstagramIcon },
  { label: "YouTube SMK BBM", href: "#", Icon: YoutubeIcon },
  { label: "WhatsApp SMK BBM", href: waLink(WA_TANYA), Icon: MessageCircle },
];

export function Footer() {
  return (
    <footer role="contentinfo" className="bg-text-primary text-slate-300 print:hidden">
      <h2 className="sr-only">Informasi footer SMK BBM</h2>
      <div className="mx-auto grid w-full max-w-[1200px] gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          <p className="flex items-center gap-2 font-bold text-white">
            <span className="flex size-10 items-center justify-center rounded-md bg-primary text-white">
              <GraduationCap className="size-6" aria-hidden />
            </span>
            {SCHOOL.namaSingkat}
          </p>
          <p className="text-sm">{SCHOOL.nama} — Mandiri Berahlak, Terampil Berwirausaha.</p>
          <p className="text-sm">NPSN {SCHOOL.npsn}</p>
          <p className="flex gap-3 pt-1">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex size-11 items-center justify-center rounded-full hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
              >
                <Icon className="size-5" />
              </a>
            ))}
          </p>
        </div>

        <nav aria-label="Menu footer">
          <p className="pb-3 font-bold text-white">Jelajahi</p>
          <ul className="flex flex-col gap-2 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Jurusan footer">
          <p className="pb-3 font-bold text-white">Program Keahlian</p>
          <ul className="flex flex-col gap-2 text-sm">
            {JURUSAN_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <address className="flex flex-col gap-2 text-sm not-italic">
          <p className="pb-1 font-bold text-white">Hubungi Kami</p>
          <p className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
            {SCHOOL.alamat}
          </p>
          <a
            href={`tel:${SCHOOL.telepon}`}
            className="flex items-center gap-2 hover:text-white hover:underline"
          >
            <Phone className="size-4 shrink-0" aria-hidden />
            {SCHOOL.telepon}
          </a>
          <a
            href={`mailto:${SCHOOL.email}`}
            className="flex items-center gap-2 hover:text-white hover:underline"
          >
            <Mail className="size-4 shrink-0" aria-hidden />
            {SCHOOL.email}
          </a>
          <p>Senin–Jumat {SCHOOL.jamSeninJumat}</p>
          <p>Sabtu {SCHOOL.jamSabtu}</p>
        </address>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto w-full max-w-[1200px] px-4 py-4 text-center text-[13px]">
          © {new Date().getFullYear()} {SCHOOL.nama} {SCHOOL.kota}. Hak cipta dilindungi.
        </p>
      </div>
    </footer>
  );
}
