"use client";

import React, { ReactNode, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/providers/user/client";
import { getApiResponse } from "@/utils/api";
import { Button } from "@nextui-org/button";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { uniqueId } from "lodash";

import { PostItem } from "@/types/post";
import { api } from "@/lib/api";
import { events } from "@/lib/events";
import { toast } from "@/components/ui/toaster";

export interface DeletePostModalProps {
  children: ReactNode;
  isOpen: boolean;
  close: () => void;
  post: PostItem;
}

export interface DeletePostInputs {}

export const DeletePostModal = ({ isOpen, close, post }: DeletePostModalProps) => {
  const router = useRouter();
  const toastId = useRef(uniqueId("_toast_")).current;
  const user = useUser();
  const [status, setStatus] = useState<"idle" | "submitting">("idle");

  const deletePost = async () => {
    setStatus("submitting");
    const { error } = await getApiResponse(api.delete(`/blog/posts/${post.id}`));

    if (error) {
      setStatus("idle");
      toast.error("Failed to delete post.");
      return;
    }

    close();
    events.next({ key: "blog.posts.deleted", value: post });
    router.refresh();
    toast.success("Post deleted successfully.");
  };

  return (
    <Modal
      isDismissable={false}
      isOpen={isOpen}
      onClose={() => {
        close();
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="h-8">Delete post</div>
        </ModalHeader>
        <ModalBody>Are you sure you want to delete &#39;{post.title}&#39; post?</ModalBody>
        <ModalFooter className="flex items-center justify-center text-center text-sm">
          <Button
            className="w-full"
            color="default"
            variant="solid"
            onClick={() => {
              close();
            }}
          >
            Cancel
          </Button>
          <Button
            className="w-full"
            color="danger"
            variant="solid"
            isLoading={status === "submitting"}
            onClick={async () => {
              await deletePost();
            }}
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
