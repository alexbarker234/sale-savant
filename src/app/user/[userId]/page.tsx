import { Steam } from "@/lib/steam";
import { notFound } from "next/navigation";
import { use } from "react";
import ClientPage from "./pageClient";

export default function Home({ params }: any) {
  const data = use(Steam.getUser(params.userId));
  if (!data) return notFound();
  return (
    <>
      <title>{`Sale Savant - ${data.displayName}'s Wishlist`}</title>
      <ClientPage userId={params.userId} userData={data} />
    </>
  );
}
