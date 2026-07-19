import "./globals.css";

export const metadata = {
  title: "ArchZen Connect",
  description: "Your AI Networking Assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
