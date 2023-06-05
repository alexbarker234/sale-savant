import "@/global.css";
import Nav from "./nav";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html>
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
            </head>
            <body>
                <main>
                    <Nav/>
                    {children}
                </main>
            </body>
        </html>
    );
}
