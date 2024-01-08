"use client";

import React, { FC, ReactNode, useMemo, useState } from "react";
import NextLink from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronRightRegular, PersonFilled } from "@fluentui/react-icons";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { isAxiosError } from "axios";
import { clone } from "lodash";
import queryString from "query-string";
import { Controller as FormController, useForm } from "react-hook-form";

import { api } from "@/lib/api";
import { PasswordInput } from "@/components/ui/password-input";
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
  const currentUrl = useMemo(() => () => (typeof window !== "undefined" ? window.location.href : ""), [])();
  const searchParams = useSearchParams();

  const form = useForm<{ method?: SignInMethods | undefined } & SignInInputs>({
    defaultValues: {
      username: "",
      password: "",
      method: (searchParams.get("method") as SignInMethods) || undefined
    }
  });
  const formErrors = useMemo(() => clone(form.formState.errors), [form.formState.isSubmitting]);

  const [status, setStatus] = useState<"idle" | "submitting">("idle");

  const submit = form.handleSubmit(async ({ method, ...inputs }) => {
    try {
      setStatus("submitting");
      switch (method) {
        case "credentials": {
          const response = await api.post("/identity/tokens/generate", inputs);
          user.set(response.data);
          break;
        }
        case "google": {
          const response = await api.post("/identity/tokens/google/generate", inputs);
          user.set(response.data);
          break;
        }
      }
      onClose();
    } catch (error) {
      console.error(error);

      if (isAxiosError(error)) {
        if (error.response) {
          const fields = Object.entries<string[]>(error.response.data.errors || []);
          fields.forEach(([name, message]) => {
            form.setError(name as any, { message: message?.join("\n") });
          });
        }
      }
    } finally {
      setStatus("idle");
    }
  });

  const user = useUser();

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Sign in to your account</ModalHeader>
        <ModalBody as="form" onSubmit={submit}>
          <Render switch={form.watch("method")}>
            <div key="credentials" className="grid gap-y-5">
              <FormController
                control={form.control}
                name="username"
                render={({ field }) => <Input {...field} label="Email or phone number" isInvalid={!!formErrors.username} errorMessage={formErrors.username?.message} />}
              />
              <FormController
                control={form.control}
                name="password"
                render={({ field }) => <PasswordInput {...field} label="Password" isInvalid={!!formErrors.password} errorMessage={formErrors.password?.message} />}
              />
              <Button color="primary" type="button" isDisabled={status != "idle"} isLoading={status == "submitting"} onPress={() => submit()}>
                Sign in
              </Button>
            </div>
            <div className="grid gap-y-5">
              <Button
                type="button"
                color="primary"
                isDisabled={status != "idle"}
                startContent={<PersonFilled fontSize={24} />}
                onPress={() => form.setValue("method", "credentials")}
              >
                Use email or phone
              </Button>
              <Button
                type="button"
                color="default"
                startContent={status == "idle" && <GoogleIcon size={24} />}
                isDisabled={status != "idle"}
                isLoading={status == "submitting"}
                onPress={() => {
                  form.setValue("method", "google");
                  submit();
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
