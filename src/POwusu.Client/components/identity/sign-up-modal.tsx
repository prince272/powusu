"use client";

import React, { FC, ReactNode, useMemo, useRef, useState } from "react";
import NextLink from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useUser } from "@/providers/user/client";
import { cn } from "@/utils";
import { getErrorMessage } from "@/utils/api";
import { ChevronLeftRegular, PersonFilled } from "@fluentui/react-icons";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { isAxiosError } from "axios";
import { clone, uniqueId } from "lodash";
import queryString from "query-string";
import { Controller as FormController, SubmitHandler, useForm } from "react-hook-form";

import { api } from "@/lib/api";
import { ExternalWindow } from "@/lib/external-window";
import { useRouter } from "@/hooks/use-router";
import { PasswordInput } from "@/components/ui/password-input";
import { Render } from "@/components/ui/render";
import { toast } from "@/components/ui/toaster";
import { GoogleIcon } from "@/components/icons";

export interface SignUpModalProps {
  children: ReactNode;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export type SignUpMethods = "credentials" | "google";

export interface SignUpInputs {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

export const SignUpModal: FC<SignUpModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl = queryString.stringifyUrl({ url: pathname, query: Object.fromEntries(searchParams) });

  const toastId = useRef(uniqueId("_toast_")).current;

  const form = useForm<{ method: SignUpMethods | undefined } & SignUpInputs>({
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      method: (searchParams.get("method") as SignUpMethods) || undefined
    }
  });
  const formErrors = useMemo(() => clone(form.formState.errors), [form.formState.isSubmitting, form.formState.isValid]);

  const [status, setStatus] = useState<"idle" | "submitting">("idle");

  const submit: SubmitHandler<{ method: SignUpMethods | undefined } & SignUpInputs> = async ({ method, ...inputs }) => {
    try {
      setStatus("submitting");
      switch (method) {
        case "credentials": {
          const response = await api.post("/identity/register", inputs);
          api.user.next(response.data);
          break;
        }
        default: {
          const externalUrl = new URL(`${api.defaults.baseURL}/identity/tokens/${method}/generate`);
          externalUrl.searchParams.set("returnUrl", window.location.origin);
          await ExternalWindow.open(externalUrl, { center: true });

          const response = await api.post(`/identity/tokens/${method}/generate`);
          api.user.next(response.data);
          break;
        }
      }

      onClose();
      router.replace(searchParams.get("callback") || pathname);
    } catch (error) {
      console.error(error);

      if (isAxiosError(error) && error?.response?.data?.requiresConfirmation) {
        router.replace(queryString.stringifyUrl({ url: currentUrl, query: { username: inputs.username, modal: "confirm-account" } }));
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
        router.replace(pathname);
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center space-x-1 h-8">
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
            <div>Sign up for a new account</div>
          </div>
        </ModalHeader>
        <ModalBody as="form" className="py-0" onSubmit={form.handleSubmit(submit)}>
          <Render switch={form.watch("method")}>
            <div key="credentials" className="grid grid-cols-12 gap-x-3 gap-y-5">
              <FormController
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <Input {...field} className="col-span-6" label="First name" isInvalid={!!formErrors.firstName} errorMessage={formErrors.firstName?.message} />
                )}
              />
              <FormController
                control={form.control}
                name="lastName"
                render={({ field }) => <Input {...field} className="col-span-6" label="Last name" isInvalid={!!formErrors.lastName} errorMessage={formErrors.lastName?.message} />}
              />
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
                  <PasswordInput {...field} className="col-span-12" label="Password" isInvalid={!!formErrors.password} errorMessage={formErrors.password?.message} />
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
                Sign up
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
                Sign up with email or phone
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
                Sgin up with Google
              </Button>
              <Button
                className="col-span-12"
                type="button"
                color="default"
                variant="flat"
                isDisabled={status != "idle"}
                as={NextLink}
                href={queryString.stringifyUrl({ url: currentUrl, query: { method: form.watch("method"), modal: "sign-in" } })}
              >
                Already registered? <span className="text-primary">Sign in</span>
              </Button>
            </div>
          </Render>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};
