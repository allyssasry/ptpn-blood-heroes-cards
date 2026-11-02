import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: "PTPN Blood Heroes – Personalized Greeting Card | Care in Action",
  description:
    "Aplikasi web resmi Personalized Greeting Card dalam rangka acara PTPN Blood Heroes – Care in Action, PT Perkebunan Nusantara III (Persero). Setetes Darah, Sejuta Harapan.",
  keywords: [
    "PTPN Blood Heroes",
    "PTPN III",
    "Donor Darah",
    "Greeting Card",
    "Care in Action",
    "Apresiasi Pahlawan Donor Darah",
  ],
  authors: [{ name: "PT Perkebunan Nusantara III (Persero)" }],
  openGraph: {
    title: "PTPN Blood Heroes – Personalized Greeting Card",
    description: "Unduh kartu apresiasi personal Anda atas kepedulian dan aksi donor darah bersama PTPN Blood Heroes.",
    type: "website",
    locale: "id_ID",
    images: [
      {
        url: "/images/fallback-template.png",
        width: 1504,
        height: 1007,
        alt: "PTPN Blood Heroes Care in Action",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="min-h-screen antialiased flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
