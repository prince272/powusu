"use client";

import React, { ReactNode, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCurrentValue } from "@/hooks";
import { useUser } from "@/providers/user/client";
import { getApiResponse } from "@/utils/api";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { isAxiosError } from "axios";
import { clone, cloneDeep, uniqueId } from "lodash";
import queryString from "query-string";
import { Controller as FormController, SubmitHandler, useForm } from "react-hook-form";
import { useTimer } from "react-timer-hook";

import { api } from "@/lib/api";
import { toast } from "@/components/ui/toaster";

export interface ConfirmAccountModalProps {
  children: ReactNode;
  isOpen: boolean;
}

export interface ConfirmAccountInputs {
  action: "sendCode" | "validateCode";
  username: string;
  code: string;
}

export const ConfirmAccountModal = ({ isOpen }: ConfirmAccountModalProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const toastId = useRef(uniqueId("_toast_")).current;

  const form = useForm<ConfirmAccountInputs>({
    defaultValues: {
      action: "sendCode",
      username: searchParams.get("username") || "",
      code: ""
    }
  });
  const formErrors = useCurrentValue(cloneDeep(form.formState.errors), () => form.formState.isSubmitting);

  const resendCodeTimer = useTimer({
    expiryTimestamp: new Date(new Date().getTime() + 59 * 1000),
    onExpire: () => {
      resendCodeTimer.restart(new Date(new Date().getTime() + 59 * 1000), false);
    },
    autoStart: false
  });
  const [codeSent, setCodeSent] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting">("idle");

  const submit: SubmitHandler<ConfirmAccountInputs> = async ({ action, ...inputs }) => {
    setStatus("submitting");

    switch (action) {
      case "sendCode": {
        const { error } = await getApiResponse(api.post("/identity/confirm", { ...inputs, sendCode: true }));

        if (error) {
          error.fields.forEach(([name, message]) => {
            form.setError(name as any, { message: message?.join("\n") });
          });

          setStatus("idle");
          toast.error(error.title, { id: toastId });
          return;
        }

        setCodeSent(true);
        setStatus("idle");
        resendCodeTimer.start();
        toast.success("Security code sent.", { id: toastId });
        break;
      }
      case "validateCode": {
        const { data: nextUser, error } = await getApiResponse(api.post("/identity/confirm", inputs));

        if (error) {
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
    }
  };

  return (
    <Modal
      isDismissable={false}
      isOpen={isOpen}
      onClose={() => {
        router.push(searchParams.get("callback") || pathname);
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="h-8">Confirm your account</div>
        </ModalHeader>
        <ModalBody as="form" className="py-0" onSubmit={form.handleSubmit(submit)}>
          <div key="credentials" className="grid grid-cols-12 gap-x-3 gap-y-5">
            <FormController
              control={form.control}
              name="username"
              render={({ field }) => (
                <Input {...field} className="col-span-12" label="Email or phone number" isInvalid={!!formErrors.username} errorMessage={formErrors.username?.message} isReadOnly />
              )}
            />
            <FormController
              control={form.control}
              name="code"
              render={({ field }) => (
                <Input
                  {...field}
                  className="col-span-12"
                  label="Enter code"
                  description={
                    <span className="text-default-400">
                      {resendCodeTimer.isRunning
                        ? `You can request the code again in ${resendCodeTimer.seconds}s.`
                        : codeSent
                          ? "Enter the code that was sent to you."
                          : "Request a code to be sent to you."}
                    </span>
                  }
                  isInvalid={!!formErrors.code}
                  errorMessage={formErrors.code?.message}
                  endContent={
                    <Button
                      className="-mt-4 px-7"
                      color="default"
                      variant="solid"
                      size="sm"
                      type="button"
                      isLoading={status == "submitting" && form.watch("action") == "sendCode"}
                      spinnerPlacement="end"
                      isDisabled={status == "submitting" || resendCodeTimer.isRunning}
                      onPress={() => {
                        form.setValue("action", "sendCode");
                        form.handleSubmit(submit)();
                      }}
                    >
                      {status == "submitting" && form.watch("action") == "sendCode" ? "Requesting code..." : "Request code"}
                    </Button>
                  }
                />
              )}
            />
            <Button
              className="col-span-12"
              color="primary"
              type="button"
              isDisabled={status != "idle" || !codeSent}
              isLoading={status == "submitting" && form.watch("action") == "validateCode"}
              onPress={() => {
                form.setValue("action", "validateCode");
                form.handleSubmit(submit)();
              }}
            >
              Confirm
            </Button>
          </div>
        </ModalBody>
        <ModalFooter className="flex items-center justify-center text-center text-sm"></ModalFooter>
      </ModalContent>
    </Modal>
  );
};
