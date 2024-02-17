"use client";

import { ComponentPropsWithoutRef, forwardRef, Key, useCallback, useEffect, useState } from "react";
import { Link as NextLink } from "@/providers/navigation";
import { useBreakpoint, useDebouncedCallback } from "@/hooks";
import { cn } from "@/utils";
import { ApiError, ApiResponse, getApiResponse } from "@/utils/api";
import { Button } from "@nextui-org/button";
import { Pagination } from "@nextui-org/pagination";
import { Skeleton } from "@nextui-org/skeleton";
import { Spinner } from "@nextui-org/spinner";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/table";
import { useQueryStates } from "nuqs";

import { PostItem, PostsPerPage } from "@/types/post";
import { api } from "@/lib/api";

import { PostCard } from "./post-card";
import { postsSearchParsers } from "./posts-search-params";
import { useRouter } from "next/navigation";

export interface PostsPageProps {
  initialStatus: "idle" | "loading" | "mounting";
  initialPageDetails?: PostsPerPage | null;
  initialError?: ApiError | null;
}

const PostsPage = ({ initialStatus, initialPageDetails, initialError }: PostsPageProps) => {
  const [status, setStatus] = useState<"idle" | "loading" | "mounting">(initialStatus);
  const [page, setPage] = useState<number>(1);
  const [pageDetails, setPageDetails] = useState(initialPageDetails);
  const [error, setError] = useState(initialError);
  const router = useRouter();

  const items = pageDetails?.items || [...Array(8)].map(() => null);
  const totalItems = pageDetails?.totalItems || 8;
  const totalPages = pageDetails?.totalPages || 2;

  const loadPage = useCallback(async (params?: any) => {
    setStatus("loading");

    const response = await getApiResponse<PostsPerPage>(api.get("/blog/posts", { params }));

    if (response.error) {
      setError(response.error);
      setPageDetails(null);
      setStatus("idle");
      return;
    }

    const newPageDetails = response.data!;

    setPageDetails(newPageDetails);
    setError(null);
    setStatus("idle");
  }, []);

  useEffect(() => {
    if (status == "loading") loadPage();
  }, []);

  return (
    <>
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton isLoaded={status != "mounting"} className="rounded-lg">
            <h1 className={"font-heading text-3xl md:text-4xl"}>Posts</h1>
          </Skeleton>
          <Skeleton isLoaded={status != "mounting"} className="rounded-lg">
            <Button color="primary" as={NextLink} href="/portal/posts/new">
              New post
            </Button>
          </Skeleton>
        </div>
        <Skeleton isLoaded={status != "mounting"} className="rounded-lg">
          <div className="text-muted-foreground text-lg">Create and manage posts.</div>
        </Skeleton>
      </div>

      <div className="mt-6 grid grid-cols-12 gap-6">
        {items.map((post, index) => (
          <PostCard key={index} post={post} isEditable className="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3" />
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Skeleton isLoaded={status != "mounting"} className="rounded-lg">
          <Pagination color="primary" showControls total={totalPages} page={page} onChange={setPage} />
        </Skeleton>
      </div>
    </>
  );
};

export { PostsPage };
