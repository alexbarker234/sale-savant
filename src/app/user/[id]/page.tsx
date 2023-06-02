import Base from "@/components/base";
import UrlForm from "@/components/urlform";
import Wishlist from "./wishlist";
import { Suspense } from "react";

export default async function Home({ params }: any) {
    return (
        <Base title="index">
            <h1>User</h1>
            <Suspense fallback={"loading test..."}>
                <Wishlist id={params.id} />
            </Suspense>
        </Base>
    );
}
