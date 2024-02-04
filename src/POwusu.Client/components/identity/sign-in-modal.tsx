"use client";

import React, { ReactNode, useMemo, useRef, useState } from "react";
import NextLink from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useUser } from "@/providers/user/client";
import { cn } from "@/utils";
import { getErrorMessage } from "@/utils/api";
import { ChevronLeftRegular, PersonFilled } from "@fluentui/react-icons";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { isAxiosError } from "axios";
import { clone, cloneDeep, uniqueId } from "lodash";
import queryString from "query-string";
import { Controller as FormController, SubmitHandler, useForm } from "react-hook-form";

import { api } from "@/lib/api";
import { ExternalWindow } from "@/lib/external-window";
import { useRouter } from "@/hooks/use-router";
import { PasswordInput } from "@/components/ui/password-input";
import { Render } from "@/components/ui/render";
import { toast } from "@/components/ui/toaster";
import { GoogleIcon } from "@/components/icons";
import { useCurrentValue } from "@/hooks";

export interface SignInModalProps {
  children: ReactNode;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export type SignInMethods = "credentials" | "google";

export interface SignInInputs {
  username: string;
  password: string;
}

export const SignInModal = ({ isOpen, onClose }: SignInModalProps) => {
  const toastId = useRef(uniqueId("_toast_")).current;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl = queryString.stringifyUrl({ url: pathname, query: Object.fromEntries(searchParams) });

  const form = useForm<{ method?: SignInMethods | undefined } & SignInInputs>({
    defaultValues: {
      username: "",
      password: "",
      method: (searchParams.get("method") as SignInMethods) || undefined
    }
  });
  const formErrors = useCurrentValue(cloneDeep(form.formState.errors), () => form.formState.isSubmitting);

  const [status, setStatus] = useState<"idle" | "submitting">("idle");

  const submit: SubmitHandler<{ method?: SignInMethods | undefined } & SignInInputs> = async ({ method, ...inputs }) => {
    try {
      setStatus("submitting");
      switch (method) {
        case "credentials": {
          const response = await api.post("/identity/tokens/generate", inputs);
          api.user.next(response.data);
          break;
        }
        default: {
          const externalUrl = new URL(`${api.defaults.baseURL}/identity/tokens/${method}/generate`);
          externalUrl.searchParams.set("origin", queryString.stringifyUrl({ url: window.location.origin, query: { ["external-window"]: true } }));

          await ExternalWindow.open(externalUrl, { center: true });

          const response = await api.post(`/identity/tokens/${method}/generate`, inputs);
          api.user.next(response.data);
          break;
        }
      }

      onClose();
      router.push(searchParams.get("callback") || pathname);
    } catch (error) {
      console.error(error);

      if (isAxiosError(error) && error?.response?.data?.requiresConfirmation) {
        router.push(queryString.stringifyUrl({ url: currentUrl, query: { username: inputs.username, modal: "confirm-account" } }));
      } else {
        const fields = Object.entries<string[]>(isAxiosError(error) ? error?.response?.data?.errors || {} : {});
        fields.forEach(([name, message]) => {
          form.setError(name as any, { message: message?.join("\n") });
        });

        toast.error(getErrorMessage(error), { id: toastId });
      }
    } finally {
      setStatus("idle");
    }
  };

  return (
    <Modal
      isDismissable={false}
      isOpen={isOpen}
      onClose={() => {
        onClose();
        router.push(searchParams.get("callback") || pathname);
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex h-8 items-center space-x-1">
            <Button
              size="sm"
              variant="light"
              isIconOnly
              className={cn(form.watch("method") != "credentials" && "hidden")}
              onPress={() => {
                form.setValue("method", undefined);
              }}
            >
              <ChevronLeftRegular fontSize={20} />
            </Button>
            <div>Sign into your account</div>
          </div>
        </ModalHeader>
        <ModalBody as="form" className="py-0" onSubmit={form.handleSubmit(submit)}>
          <Render switch={form.watch("method")}>
            <div key="credentials" className="grid grid-cols-12 gap-x-3 gap-y-5">
              <FormController
                control={form.control}
                name="username"
                render={({ field }) => (
                  <Input {...field} className="col-span-12" label="Email or phone number" isInvalid={!!formErrors.username} errorMessage={formErrors.username?.message} />
                )}
              />
              <FormController
                control={form.control}
                name="password"
                render={({ field }) => (
                  <div className="col-span-12">
                    <PasswordInput {...field} label="Password" isInvalid={!!formErrors.password} errorMessage={formErrors.password?.message} />
                    <div className="flex justify-end px-1 py-2">
                      <Link
                        as={NextLink}
                        href={queryString.stringifyUrl({
                          url: currentUrl,
                          query: { method: undefined, username: form.watch("username") || undefined, modal: "reset-password" }
                        })}
                        size="sm"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </div>
                )}
              />
              <Button
                className="col-span-12"
                color="primary"
                type="button"
                variant="solid"
                isDisabled={status != "idle"}
                isLoading={status == "submitting"}
                onPress={() => form.handleSubmit(submit)()}
              >
                Sign in
              </Button>
            </div>
            <div className="grid grid-cols-12 gap-y-5">
              <Button
                className="col-span-12"
                type="button"
                color="primary"
                variant="solid"
                isDisabled={status != "idle"}
                startContent={<PersonFilled fontSize={24} />}
                onPress={() => form.setValue("method", "credentials")}
              >
                Sign in with email or phone
              </Button>
              <Button
                className="col-span-12 light"
                type="button"
                color="default"
                variant="solid"
                startContent={status == "idle" && <GoogleIcon size={24} />}
                isDisabled={status != "idle"}
                isLoading={status == "submitting"}
                onPress={() => {
                  form.setValue("method", "google");
                  form.handleSubmit(submit)();
                }}
              >
                Continue with Google
              </Button>
              <Button
                className="col-span-12"
                type="button"
                color="default"
                variant="flat"
                isDisabled={status != "idle"}
                as={NextLink}
                href={queryString.stringifyUrl({ url: currentUrl, query: { method: form.watch("method"), modal: "sign-up" } })}
              >
                Don&apos;t have an account? <span className="text-primary">Sign up</span>
              </Button>
            </div>
          </Render>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};
