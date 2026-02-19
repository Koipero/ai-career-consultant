import { Inter } from "next/font/google";
import "./globals.css";
import MobileShell from "../components/MobileShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Career Consultant",
  description: "AI-powered career matching and gap analysis engine",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <MobileShell>
          {children}
        </MobileShell>
      </body>
    </html>
  );
}
