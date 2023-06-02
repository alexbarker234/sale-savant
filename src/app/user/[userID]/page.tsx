import UserInfo from "./userInfo";
import Wishlist from "./wishlist";

export default function Home({ params }: any) {
    // potentially make user info load serverside before page load
    return (
        <>
            <title>user page</title>
            <UserInfo userID={params.userID} />
            <Wishlist userID={params.userID} />
        </>
    );
}
