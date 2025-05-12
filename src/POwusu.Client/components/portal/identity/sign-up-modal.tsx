"use client";

import React, { ReactNode, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCurrentValue } from "@/hooks";
import { useUser } from "@/providers/user/client";
import { cn } from "@/utils";
import { getApiResponse } from "@/utils/api";
import FlatColorIconsGoogle from "@iconify/icons-flat-color-icons/google";
import SolarAltArrowLeftOutline from "@iconify/icons-solar/alt-arrow-left-outline";
import SolarUserBold from "@iconify/icons-solar/user-bold";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { isAxiosError } from "axios";
import { clone, cloneDeep, uniqueId } from "lodash";
import queryString from "query-string";
import { Controller as FormController, SubmitHandler, useForm } from "react-hook-form";

import { api } from "@/lib/api";
import { externalWindow } from "@/lib/external-window";
import { Icon } from "@/components/ui/icon";
import { Link as NextLink } from "@/components/ui/navigation";
import { PasswordInput } from "@/components/ui/password-input";
import { Switch } from "@/components/ui/render";
import { toast } from "@/components/ui/toaster";

export interface SignUpModalProps {
  children: ReactNode;
  isOpen: boolean;
}

export type SignUpMethods = "credentials" | "google";

export interface SignUpInputs {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

export const SignUpModal = ({ isOpen }: SignUpModalProps) => {
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
  const formErrors = useCurrentValue(cloneDeep(form.formState.errors), () => form.formState.isSubmitting);

  const [status, setStatus] = useState<"idle" | "submitting">("idle");

  const submit: SubmitHandler<{ method: SignUpMethods | undefined } & SignUpInputs> = async ({ method, ...inputs }) => {
    setStatus("submitting");

    switch (method) {
      case "credentials": {
        const { data: nextUser, error } = await getApiResponse(api.post("/identity/register", inputs));

        if (error) {
          if (error.data?.requiresConfirmation) {
            router.push(queryString.stringifyUrl({ url: currentUrl, query: { username: inputs.username, modal: "confirm-account" } }));
            return;
          }

          error.fields.forEach(([name, message]) => {
            form.setError(name as any, { message: message?.join("\n") });
          });

          setStatus("idle");
          toast.error(error.title, { id: toastId });
          return;
        }

        api.user.next(nextUser);
        router.replace(searchParams.get("callback") || pathname);
        break;
      }

      default: {
        const externalUrl = new URL(`${api.defaults.baseURL}/identity/tokens/${method}/generate`);
        externalUrl.searchParams.set("origin", queryString.stringifyUrl({ url: window.location.origin, query: { ["external-window"]: true } }));
        try {
          await externalWindow.open(externalUrl, { center: true });
        } catch (error) {
          setStatus("idle");
          console.error(error);
          return;
        }
        const { data: nextUser, error } = await getApiResponse(api.post(`/identity/tokens/${method}/generate`, inputs));

        if (error) {
          if (error.data?.requiresConfirmation) {
            router.push(queryString.stringifyUrl({ url: currentUrl, query: { username: inputs.username, modal: "confirm-account" } }));
            return;
          }

          error.fields.forEach(([name, message]) => {
            form.setError(name as any, { message: message?.join("\n") });
          });

          setStatus("idle");
          toast.error(error.title, { id: toastId });
          return;
        }

        api.user.next(nextUser);
        router.replace(searchParams.get("callback") || pathname);
      }
    }
  };

  return (
    <Modal
      isDismissable={false}
      isOpen={isOpen}
      onClose={() => {
        router.push(pathname);
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
              <Icon icon={SolarAltArrowLeftOutline} width="24" height="24" />
            </Button>
            <div>Sign up for a new account</div>
          </div>
        </ModalHeader>
        <ModalBody as="form" className="py-0" onSubmit={form.handleSubmit(submit)}>
          <Switch switch={form.watch("method")}>
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
                startContent={<Icon icon={SolarUserBold} width="24" height="24" />}
                onPress={() => form.setValue("method", "credentials")}
              >
                Sign up with email or phone
              </Button>
              <Button
                className="col-span-12 light"
                type="button"
                color="default"
                variant="solid"
                startContent={status == "idle" && <Icon icon={FlatColorIconsGoogle} width="24" height="24" />}
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
                href={queryString.stringifyUrl({ url: currentUrl, query: { method: form.watch("method"), modal: "sign-in" } })}
              >
                Already registered? <span className="text-primary">Sign in</span>
              </Button>
            </div>
          </Switch>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};
