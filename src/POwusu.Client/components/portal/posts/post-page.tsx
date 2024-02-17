"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Link as NextLink } from "@/providers/navigation";
import { useRouter } from "next/navigation";
import { useCurrentValue } from "@/hooks";
import { parseJSON, stringifyJSON } from "@/utils";
import { ApiError, getApiResponse, getError, getErrorTitle } from "@/utils/api";
import EditorJS from "@editorjs/editorjs";
import { ChevronLeftFilled } from "@fluentui/react-icons";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Textarea } from "@nextui-org/input";
import { isAxiosError } from "axios";
import { cloneDeep, uniqueId } from "lodash";
import { Controller as FormController, SubmitHandler, useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";

import { Post } from "@/types/post";
import { api } from "@/lib/api";
import { Editor, getEditorInfo } from "@/components/ui/editor";
import { FileInput } from "@/components/ui/file-input";
import { toast } from "@/components/ui/toaster";

interface PostPageProps {
  postId?: string;
  initialPost?: Post | null | undefined;
  initialError?: ApiError | null | undefined;
}

interface PostPageInputs {
  title: string;
  content: string;
  imageId: string;
}

const PostPage = ({ postId, initialPost, initialError }: PostPageProps) => {
  const [post, setPost] = useState(initialPost);
  const [error, setError] = useState(initialError);

  const [status, setStatus] = useState<"idle" | "submitting">("idle");

  const editor = useRef<EditorJS>(null!);
  const router = useRouter();

  const toastId = useRef(uniqueId("_toast_")).current;

  const form = useForm<PostPageInputs>({
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

  const submit: SubmitHandler<PostPageInputs> = async (inputs) => {
    setStatus("submitting");

    const content = parseJSON(inputs.content);
    const { readingDuration, summary } = getEditorInfo(content);
    inputs = { ...inputs, readingDuration, summary } as any;

    const { data: updatedPost, error } = await getApiResponse<Post>(!postId ? api.post("/blog/posts", inputs) : api.put(`/blog/posts/${postId}`, inputs));

    if (error) {
      error.fields.forEach(([name, message]) => {
        form.setError(name as any, { message: message?.join("\n") });
      });

      setError(error);
      setPost(null);
      setStatus("idle");

      toast.error(error.title, { id: toastId });
      return;
    }

    setPost(updatedPost);
    setError(null);
    setStatus("idle");
    toast.success(!postId ? "Post created." : "Post updated.", { id: toastId });

    if (!postId) {
      router.replace(`/portal/posts/${updatedPost!.id}`);
    }

    router.refresh();
  };

  return (
    <form onSubmit={form.handleSubmit(submit)}>
      <div className="grid w-full gap-5">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center space-x-5">
            <Button as={NextLink} href="/portal/posts" variant="light" startContent={<ChevronLeftFilled fontSize={24} />}>
              Back
            </Button>
          </div>
          <div className="flex items-center space-x-5">
            <Button type="submit" color="primary" isLoading={status == "submitting"}>
              Save
            </Button>
          </div>
        </div>
        <div className="prose prose-xl prose-light mx-auto flex w-full flex-col dark:prose-dark">
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
                  input: "text-5xl font-bold sm:text-4x focus:outline-none bg-transparent",
                  inputWrapper: "bg-transparent data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent"
                }}
                isInvalid={!!formErrors.title}
                errorMessage={formErrors.title?.message}
              />
            )}
          />
          <FormController
            control={form.control}
            name="content"
            render={({ field }) => (
              <Editor
                data={parseJSON(field.value)}
                onReady={() => {
                  form.setFocus("title");
                }}
                onChange={async (api, event) => field.onChange(stringifyJSON(await api.saver.save()))}
                editorInstance={(instance) => (editor.current = instance)}
              />
            )}
          />
          <p className="p-3 text-center text-sm text-default-500">
            Use{" "}
            <Chip as="kbd" size="sm">
              Tab
            </Chip>{" "}
            to open the command menu.
          </p>
        </div>
      </div>
    </form>
  );
};

export { PostPage };
