import { SessionProvider } from "@/components/session-provider";
import "@/global.scss";
import { Poppins } from "next/font/google";
import Footer from "./footer";
import Nav from "./nav";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
  display: "swap"
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={poppins.className}>
        <SessionProvider>
          <main>
            <Nav />
            <div className="content">{children}</div>
            <Footer />
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
