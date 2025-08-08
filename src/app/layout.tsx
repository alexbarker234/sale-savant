import { SessionProvider } from "@/components/session-provider";
import "@/global.scss";
import Footer from "./footer";
import Nav from "./nav";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
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
