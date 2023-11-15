
import { use } from "react";
import { notFound, redirect } from 'next/navigation';
import ClientPage from "./clientPage";
import { Steam } from "@/lib/steam";

export default function Home({ params }: any) {
    const data = use(Steam.getUser(params.userId));
   if (!data) return notFound()
    return (
        <>
            <title>{`Sale Savant - ${data.displayName}'s Wishlist`}</title>
            <ClientPage userId={params.userId} userData={data}/>
        </>
    );
}
