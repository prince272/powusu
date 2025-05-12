"use client";

import { ComponentPropsWithoutRef, forwardRef, Key, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBreakpoint, useDebouncedCallback, useEffectAfterMount } from "@/hooks";
import { cn, stringifyJSON } from "@/utils";
import { ApiError, ApiResponse, getApiResponse } from "@/utils/api";
import SolarDocumentBoldDuotone from "@iconify/icons-solar/document-bold-duotone";
import SolarFileCorruptedBoldDuotone from "@iconify/icons-solar/file-corrupted-bold-duotone";
import SolarRestartLinear from "@iconify/icons-solar/restart-linear";
import { Button } from "@heroui/button";
import { Pagination } from "@heroui/pagination";
import { Skeleton } from "@heroui/skeleton";
import { Spinner } from "@heroui/spinner";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/table";
import { isEqual } from "lodash";
import { useQueryState, useQueryStates } from "nuqs";

import { PostItem, PostsPerPage } from "@/types/post";
import { api } from "@/lib/api";
import { events } from "@/lib/events";
import { Icon } from "@/components/ui/icon";
import { Link as NextLink } from "@/components/ui/navigation";

import { PostCard } from "./post-card";
import { postsSearchParsers } from "./posts-search-params";

export interface PostsPageProps {
  initialStatus: "idle" | "loading" | "mounting";
  initialPageDetails?: PostsPerPage | null;
  initialError?: ApiError | null;
}

const PostsPage = ({ initialStatus, initialPageDetails, initialError }: PostsPageProps) => {
  const [status, setStatus] = useState<"idle" | "loading" | "mounting">(initialStatus);

  const router = useRouter();
  const [searchParams, setSearchParams] = useQueryStates(postsSearchParsers);

  const { page } = searchParams;
  const setPage = (page: number) => setSearchParams((params) => ({ ...params, page }));
  const [pageDetails, setPageDetails] = useState(initialPageDetails);

  const [error, setError] = useState(initialError);

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

    router.refresh();
    setPageDetails(newPageDetails);
    setError(null);
    setStatus("idle");
  }, []);

  useEffectAfterMount(() => {
    loadPage(searchParams);
  }, [stringifyJSON(searchParams)]);

  useEffect(() => {
    const subscription = events.subscribeTo(() => {
      loadPage(searchParams);
    }, ["blog.posts.created", "blog.posts.updated", "blog.posts.deleted"]);

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton isLoaded={status != "mounting"} className="z-20 rounded-xl">
            <h1 className={"font-heading text-3xl md:text-4xl"}>Posts</h1>
          </Skeleton>
          <Skeleton isLoaded={status != "mounting"} className="z-20 rounded-xl">
            <Button color="primary" as={NextLink} href="/portal/posts/new">
              New post
            </Button>
          </Skeleton>
        </div>
        <Skeleton isLoaded={status != "mounting"} className="z-20 rounded-xl">
          <div className="text-lg text-default-500">Create and manage posts.</div>
        </Skeleton>
      </div>

      <div className="mt-6 grid h-full grid-cols-12 gap-6">
        {pageDetails?.items?.map((post, index) => (
          <PostCard key={index} post={post} isEditable isLoaded={status != "mounting" && status != "loading"} className="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3" />
        ))}
        {pageDetails?.items?.length == 0 && (
          <div className="col-span-full flex h-full items-start justify-center pt-16">
            <div className="flex flex-col items-center justify-center space-y-3">
              <Icon icon={SolarDocumentBoldDuotone} width="96" height="96" className="text-primary" />
              <p className="text-default-500">No posts found.</p>
            </div>
          </div>
        )}
        {error && (
          <div className="col-span-full flex h-full items-start justify-center pt-16">
            <div className="flex flex-col items-center justify-center space-y-3">
              <Icon icon={SolarFileCorruptedBoldDuotone} width="96" height="96" />
              <p className="text-default-500">
                {error.title} {error.status || -1}
              </p>
              {error.status != 404 && (
                <Button
                  color="default"
                  variant="solid"
                  isLoading={status == "loading"}
                  startContent={status != "loading" && <Icon icon={SolarRestartLinear} width="24" height="24" />}
                  onClick={() => loadPage(searchParams)}
                >
                  Reload
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {!!pageDetails?.totalPages && (
        <div className="mt-12 flex justify-center">
          <Skeleton isLoaded={status != "mounting"} className="z-20 rounded-xl">
            <Pagination color="primary" showControls total={pageDetails?.totalPages} page={page} onChange={setPage} />
          </Skeleton>
        </div>
      )}
    </>
  );
};

export { PostsPage };
