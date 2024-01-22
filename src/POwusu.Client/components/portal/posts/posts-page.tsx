import { FC } from "react";

const PostsPage: FC = () => {
  return (
    <>
      <div className="grid items-start gap-8">
        <div className="flex items-center justify-between px-2">
          <div className="grid gap-1">
            <h1 className="font-heading text-3xl md:text-4xl">Posts</h1>
            <p className="text-muted-foreground text-lg">Create and manage posts.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export { PostsPage };
