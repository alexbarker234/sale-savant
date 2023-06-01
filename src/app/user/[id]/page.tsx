import Base from "@/components/base";
import UrlForm from "@/components/urlform";
import Wishlist from "./wishlist";

export default async function Home({ params }: any) {
    return (
        <Base title="index">
            <h1>User</h1>
            <Wishlist id={params.id} />
        </Base>
    );
}
