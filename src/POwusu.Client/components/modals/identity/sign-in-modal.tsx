"use client";

import React, { FC, ReactNode, useMemo, useRef, useState } from "react";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getErrorMessage } from "@/utils/axios";
import { ChevronRightRegular, PersonFilled } from "@fluentui/react-icons";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { isAxiosError } from "axios";
import { clone, uniqueId } from "lodash";
import queryString from "query-string";
import { Controller as FormController, SubmitHandler, useForm } from "react-hook-form";

import { api } from "@/lib/api";
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from "@/components/ui/toaster";
import { GoogleIcon } from "@/components/icons";
import { Render } from "@/components/misc/render";
import { useUser } from "@/components/providers/user";

export interface SignInModalProps {
  children: ReactNode;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onOpenChange: () => void;
}

export type SignInMethods = "credentials" | "google";

export interface SignInInputs {
  username: string;
  password: string;
}

export const SignInModal: FC<SignInModalProps> = ({ isOpen, onOpenChange, onClose }) => {
  const toastId = useRef(uniqueId()).current;
  const currentUrl = useMemo(() => () => (typeof window !== "undefined" ? window.location.href : ""), [])();
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<{ method?: SignInMethods | undefined } & SignInInputs>({
    defaultValues: {
      username: "",
      password: "",
      method: (searchParams.get("method") as SignInMethods) || undefined
    }
  });
  const formErrors = useMemo(() => clone(form.formState.errors), [form.formState.isSubmitting, form.formState.isValid]);

  const [status, setStatus] = useState<"idle" | "submitting">("idle");

  const submit : SubmitHandler<{ method?: SignInMethods | undefined } & SignInInputs> = async ({ method, ...inputs }) => {
    try {
      setStatus("submitting");
      switch (method) {
        case "credentials": {
          const response = await api.post("/identity/tokens/generate", inputs);
          user.set({ ...response.data, authenticated: true });
          break;
        }
        case "google": {
          const response = await api.post("/identity/tokens/google/generate", inputs);
          user.set({ ...response.data, authenticated: true });
          break;
        }
      }
      onClose();
    } catch (error) {
      console.error(error);

      if (isAxiosError(error) && error?.response?.data?.requiresConfirmation) {
        router.replace(queryString.stringifyUrl({ url: currentUrl, query: { username: inputs.username }, fragmentIdentifier: "confirm-account" }));
      } else {
        const fields = Object.entries<string[]>((isAxiosError(error) ? error?.response?.data?.errors : []) || []);
        fields.forEach(([name, message]) => {
          form.setError(name as any, { message: message?.join("\n") });
        });

        toast.error(getErrorMessage(error), { id: toastId });
      }
    } finally {
      setStatus("idle");
    }
  };

  const user = useUser();

  return (
    <Modal isDismissable={false} isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Sign in to your account</ModalHeader>
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
                          query: { method: undefined, username: form.watch("username") || undefined },
                          fragmentIdentifier: "reset-password"
                        })}
                        size="sm"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </div>
                )}
              />
              <Button className="col-span-12" color="primary" type="button" isDisabled={status != "idle"} isLoading={status == "submitting"} onPress={() => form.handleSubmit(submit)()}>
                Sign in
              </Button>
            </div>
            <div className="grid grid-cols-12 gap-y-5">
              <Button
                className="col-span-12"
                type="button"
                color="primary"
                isDisabled={status != "idle"}
                startContent={<PersonFilled fontSize={24} />}
                onPress={() => form.setValue("method", "credentials")}
              >
                Use email or phone
              </Button>
              <Button
                className="col-span-12"
                type="button"
                color="default"
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
            </div>
          </Render>
        </ModalBody>
        <ModalFooter className="flex items-center justify-center text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link as={NextLink} className="text-sm" href={queryString.stringifyUrl({ url: currentUrl, query: { method: form.watch("method") }, fragmentIdentifier: "sign-up" })}>
            Sign up <ChevronRightRegular fontSize={20} />
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
