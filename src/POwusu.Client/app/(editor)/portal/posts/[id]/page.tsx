import { getApiResponse } from "@/utils/api";

import { Post } from "@/types/post";
import { api } from "@/lib/api";
import { AddPostPage } from "@/components/portal/posts/add-post-page";

export interface PageProps {
  params: { id: string };
}

const Page = async ({ params: { id: postId } }: PageProps) => {
  if (postId == "new") {
    return <AddPostPage />;
  } else {
    const response = await getApiResponse<Post>(api.get(`/blog/posts/${postId}`));
    return <AddPostPage postId={postId} initialPost={response.data} initialError={response.error} />;
  }
};

export default Page;
