import "@/global.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html>
            <head>
                <link rel="shortcut icon" href="/favicon.ico" />
                <meta name="description" content={`test description`} />
            </head>
            <body>
                <main>{children}</main>
            </body>
        </html>
    );
}
