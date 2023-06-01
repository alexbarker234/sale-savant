import Head from "next/head";

type BaseProp = {
    title: string;
    children: React.ReactNode;
};

const Base = ({ title, children }: BaseProp) => {
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <main>{children}</main>
        </>
    );
};

export default Base;
