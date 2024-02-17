import { PostsPage } from "@/components/portal/posts/posts-page";

export interface PageProps {
}

const Loading = async (props: PageProps) => {
  return <PostsPage initialStatus="mounting" />;
};

export default Loading;
