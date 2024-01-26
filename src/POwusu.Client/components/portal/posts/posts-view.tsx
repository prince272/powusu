"use client";

import { FC, Key, useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "@/hooks";
import { ApiError, ApiResponse, getApiResponse } from "@/utils/api";
import { Pagination } from "@nextui-org/pagination";
import { Spinner } from "@nextui-org/spinner";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/table";
import { useQueryStates } from "nuqs";

import { PostItem, PostsPage } from "@/types/post";
import { api } from "@/lib/api";

import { postsSearchParsers } from "./posts-search-params";

export interface PostsPageProps {
  initialPage?: PostsPage;
  initialError?: ApiError
}

const PostsView: FC<PostsPageProps> = ({ initialPage, initialError }) => {
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [searchParams, setSearchParams] = useQueryStates(postsSearchParsers);
  const { page, pageSize } = searchParams;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [error, setError] = useState<ApiError | null | undefined>(initialError);

  const columns = [
    {
      key: "title",
      label: "TITLE"
    },
    {
      key: "role",
      label: "ROLE"
    },
    {
      key: "status",
      label: "STATUS"
    }
  ];

  const rows = currentPage?.items || [];

  const totalPages = currentPage?.totalPages || 0;

  const loadPage = useCallback(async (nextSearchParams: typeof searchParams) => {
    setStatus("loading");
    const response = await getApiResponse<PostsPage>(api.get("/blog/posts", { params: nextSearchParams }));

    if (response.error) {
      setError(response.error);
      setStatus("idle");
      return;
    }

    setCurrentPage(response.data);
    setStatus("idle");
  }, []);

  useEffect(() => { loadPage(searchParams); }, [loadPage, searchParams]);

  const renderCell = useCallback((post: PostItem, columnKey: Key) => {
    const cellValue = post[columnKey as keyof PostItem];
    return cellValue;
  }, []);

  return (
    <>
      <div className="flex flex-col items-start space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="grid gap-1">
            <h1 className="font-heading text-3xl md:text-4xl">Posts</h1>
            <p className="text-muted-foreground text-lg">Create and manage posts.</p>
          </div>
        </div>
        <Table
          removeWrapper
          aria-label="Example static collection table"
          bottomContent={
            totalPages > 0 ? (
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={totalPages}
                  onChange={(nextPage) => setSearchParams({ ...searchParams, page: nextPage })}
                />
              </div>
            ) : null
          }
        >
          <TableHeader columns={columns}>{(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}</TableHeader>
          <TableBody emptyContent={!error ? "No posts." : error.title} loadingState={status} loadingContent={<Spinner />} items={rows}>
            {(item) => <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export { PostsView };
