import "@/global.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html>
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
            </head>
            <body>
                <main>{children}</main>
            </body>
        </html>
    );
}
