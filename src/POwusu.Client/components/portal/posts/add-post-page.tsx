"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentValue } from "@/hooks";
import { parseJSON } from "@/utils";
import { ApiError, getApiResponse, getErrorTitle } from "@/utils/api";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Textarea } from "@nextui-org/input";
import { cloneDeep, uniqueId } from "lodash";
import { Controller as FormController, SubmitHandler, useForm } from "react-hook-form";

import { Post } from "@/types/post";
import { api } from "@/lib/api";
import { events } from "@/lib/events";
import { FileInput } from "@/components/ui/file-input";
import { Icon } from "@/components/ui/icon";
import { Link as NextLink } from "@/components/ui/navigation";
import { toast } from "@/components/ui/toaster";
import { PlateEditor } from "@/components/ui/editor/plate-editor";

import SolarAltArrowLeftOutline from "@iconify/icons-solar/alt-arrow-left-outline";

interface AddPostPageProps {
  postId?: string;
  initialPost?: Post | null | undefined;
  initialError?: ApiError | null | undefined;
}

interface AddPostPageInputs {
  title: string;
  content: string;
  imageId: string;
}

const AddPostPage = ({ postId, initialPost, initialError }: AddPostPageProps) => {
  const [post, setPost] = useState(initialPost);
  const [error, setError] = useState(initialError);

  const [status, setStatus] = useState<"idle" | "submitting">("idle");

  const router = useRouter();

  const toastId = useRef(uniqueId("_toast_")).current;

  const form = useForm<AddPostPageInputs>({
    defaultValues: {
      title: post?.title,
      content: post?.content,
      imageId: post?.imageId
    }
  });

  const formErrors = useCurrentValue(cloneDeep(form.formState.errors), () => form.formState.isSubmitting);

  const load = useCallback(async () => {
    if (postId && !initialPost) {
      //const response = await getApiResponse<Post>(api.get(`/blog/posts/${postId}`));
    }
  }, [initialPost, postId, toastId]);

  const submit: SubmitHandler<AddPostPageInputs> = async (inputs) => {
    setStatus("submitting");
  };

  return (
    <form className="flex h-full w-full flex-col gap-5" onSubmit={form.handleSubmit(submit)}>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center space-x-5">
          <Button as={NextLink} href="/portal/posts" variant="light" startContent={<Icon icon={SolarAltArrowLeftOutline} width="24" height="24" />}>
            Back
          </Button>
        </div>
        <div className="flex items-center space-x-5">
          <Button type="submit" color="primary" isLoading={status == "submitting"}>
            Save
          </Button>
        </div>
      </div>
      <div className="mx-auto flex w-full flex-col">
        <div className="mb-5">
          <FormController
            control={form.control}
            name="imageId"
            render={({ field }) => (
              <FileInput
                {...field}
                onUploadError={(error) => {
                  toast.error(getErrorTitle(error, "Unable to upload image."), { id: toastId });
                }}
                onDowloadError={(error) => {
                  toast.error(getErrorTitle(error, "Unable to load image."), { id: toastId });
                }}
                onRevertError={(error) => {
                  // toast.error(getErrorTitle(error, "Unable to remove image."), { id: toastId });
                }}
                variant="rectangle"
                endpoint={`/blog/posts/images`}
              />
            )}
          />
        </div>
        <FormController
          control={form.control}
          name="title"
          render={({ field }) => (
            <Textarea
              {...field}
              minRows={1}
              placeholder="Enter title"
              className="w-full focus:outline-none"
              classNames={{
                input: "font-bold text-4xl focus:outline-none bg-transparent",
                inputWrapper: "bg-transparent data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent"
              }}
              isInvalid={!!formErrors.title}
              errorMessage={formErrors.title?.message}
            />
          )}
        />
      </div>
      <PlateEditor />
    </form>
  );
};

export { AddPostPage };
