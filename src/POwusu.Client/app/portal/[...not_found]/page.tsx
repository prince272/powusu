import { NotFoundPage } from "@/components/portal/not-found-page";

export interface PageProps {}

const Page = async (props: PageProps) => {
  return <NotFoundPage />;
};

export default Page;
