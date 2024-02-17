import { getApiResponse } from "@/utils/api";

import { Post } from "@/types/post";
import { api } from "@/lib/api";
import { PostPage } from "@/components/portal/posts/post-page";

export interface PageProps {
  params: { id: string };
}

const Page = async ({ params: { id: postId } }: PageProps) => {
  if (postId == "new") {
    return <PostPage />;
  } else {
    const response = await getApiResponse<Post>(api.get(`/blog/posts/${postId}`));
    return <PostPage postId={postId} initialPost={response.data} initialError={response.error} />;
  }
};

export default Page;
