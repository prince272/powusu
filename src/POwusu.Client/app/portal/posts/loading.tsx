import { PostItem } from "@/types/post";
import { PostsPage } from "@/components/portal/posts/posts-page";

export interface PageProps {}

const Loading = async (props: PageProps) => {
  return (
    <PostsPage
      initialStatus="mounting"
      initialPageDetails={{
        currentPage: 1,
        items: [...Array(4)].map(() => null as unknown as PostItem),
        nextPage: 1,
        previousPage: 1,
        totalItems: 4,
        totalPages: 1
      }}
    />
  );
};

export default Loading;
