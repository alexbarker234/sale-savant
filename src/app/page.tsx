import HomePageDeals from "@/components/HomePageDeals";
import { CheapShark } from "@/lib/cheapShark";
import { Suspense, use } from "react";
import UrlForm from "./urlform";

const HomePageDealsServer = () => {
  const deals = use(CheapShark.getHomePageDeals());
  return <HomePageDeals deals={deals} />;
};

export default async function Home() {
  return (
    <>
      <title>Sale Savant</title>
      <UrlForm />
      <Suspense fallback={<div>Loading deals...</div>}>
        <HomePageDealsServer />
      </Suspense>
    </>
  );
}
