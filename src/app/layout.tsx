import type { Metadata } from "next";
import Script from "next/script";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Topbar } from "@/components/Topbar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WAFloat } from "@/components/WAFloat";
import { ConsentBanner } from "@/components/ConsentBanner";
import { SCHOOL } from "@/lib/constants";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://smkbbm-kandanghaur.sch.id";
const gaId = process.env.NEXT_PUBLIC_GA_ID ?? "";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "SMK BBM Kandanghaur — Mandiri Berahlak, Terampil Berwirausaha",
    template: "%s — SMK BBM Kandanghaur",
  },
  description:
    "Website resmi SMK Bangun Bangsa Mandiri (BBM) Kandanghaur, Indramayu — profil, jurusan, fasilitas, berita, galeri, info PPDB & kontak. NPSN 20233754.",
  alternates: { canonical: baseUrl },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "SMK BBM Kandanghaur",
    images: [{ url: "/og-default.svg", width: 1200, height: 630 }],
  },
};

const schoolJsonLd = {
  "@context": "https://schema.org",
  "@type": "School",
  name: SCHOOL.nama,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Jl. PU Kemped No.212",
    addressLocality: "Kandanghaur",
    addressRegion: "Jawa Barat",
    postalCode: "45254",
    addressCountry: "ID",
  },
  email: SCHOOL.email,
  identifier: SCHOOL.npsn,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${jakarta.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#konten"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
        >
          Lewati ke konten
        </a>
        <Topbar />
        <Navbar />
        <main id="konten" className="flex flex-1 flex-col">
          <NuqsAdapter>{children}</NuqsAdapter>
        </main>
        <Footer />
        <WAFloat />
        <ConsentBanner />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schoolJsonLd) }}
        />
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});gtag('consent','default',{analytics_storage:'denied'});`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
