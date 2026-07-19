import "./globals.css";

export const metadata = {
  title: "ArchZen Contact Vault",
  description: "Scan business cards and prepare personal follow-up emails."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
