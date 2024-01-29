import { getApiResponse } from "@/utils/api";

import { PostsPage } from "@/types/post";
import { api } from "@/lib/api";
import { postsSearchParamsCache } from "@/components/portal/posts/posts-search-params";
import { PostsView } from "@/components/portal/posts/posts-view";

export interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

const Page = async (props: PageProps) => {
  const searchParams = postsSearchParamsCache.parse(props.searchParams);
  const response = await getApiResponse<PostsPage>(api.get("/blog/posts", { params: searchParams }));
  return <PostsView initialPage={response.data} initialError={response.error} />;
};

export default Page;
