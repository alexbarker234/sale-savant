import Wishlist from "./wishlist";

export default function Home({ params }: any) {
    return (
        <>
            <title>user page</title>
            <h1>User</h1>
            <Wishlist userID={params.userID} />
        </>
    );
}
