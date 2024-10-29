import "@/global.scss";
import Nav from "./nav";
import Footer from "./footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <main>
          <Nav />
          <div className="content">{children}</div>
          <Footer />
        </main>
      </body>
    </html>
  );
}
