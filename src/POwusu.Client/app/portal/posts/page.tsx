import { getApiResponse } from "@/utils/api";

import { PostsPerPage } from "@/types/post";
import { api } from "@/lib/api";
import { postsSearchParamsCache } from "@/components/portal/posts/posts-search-params";
import { PostsPage } from "@/components/portal/posts/posts-page";

export interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

const Page = async (props: PageProps) => {
  const searchParams = postsSearchParamsCache.parse(props.searchParams);
  const response = await getApiResponse<PostsPerPage>(api.get("/blog/posts", { params: searchParams }));
  return <PostsPage initialStatus="idle" initialPageDetails={response.data} initialError={response.error} />;
};

export default Page;
