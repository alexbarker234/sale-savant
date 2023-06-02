import Base from "@/components/base";
import Wishlist from "./wishlist";
import { Suspense } from "react";

export default function Home({ params }: any) {

    console.log("test")

    return (
        <Base title="index">
            <h1>User</h1>
            <Suspense fallback={"loading test..."}>
                <Wishlist id={params.id} />
            </Suspense>
        </Base>
    );
}
