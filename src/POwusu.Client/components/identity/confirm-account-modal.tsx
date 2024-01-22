"use client";

import React, { FC, ReactNode, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getErrorMessage } from "@/utils/axios";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { isAxiosError } from "axios";
import { clone, uniqueId } from "lodash";
import { Controller as FormController, SubmitHandler, useForm } from "react-hook-form";
import { useTimer } from "react-timer-hook";

import { api } from "@/lib/api";
import { toast } from "@/components/ui/toaster";
import { useUser } from "@/providers/user/client";

export interface ConfirmAccountModalProps {
  children: ReactNode;
  isOpen: boolean;
  onOpen: () => void;
  onClose: (submitted?: boolean) => void;
}

export interface ConfirmAccountInputs {
  action: "send-code" | "validate-code";
  username: string;
  code: string;
}

export const ConfirmAccountModal: FC<ConfirmAccountModalProps> = ({ isOpen, onClose }) => {
  const currentUrl = useMemo(() => () => (typeof window !== "undefined" ? window.location.href : ""), [])();
  const searchParams = useSearchParams();
  const toastId = useRef(uniqueId()).current;

  const { setUser } = useUser();

  const form = useForm<ConfirmAccountInputs>({
    defaultValues: {
      username: searchParams.get("username") || "",
      code: "",
      action: "send-code"
    }
  });
  const formErrors = useMemo(() => clone(form.formState.errors), [form.formState.isSubmitting, form.formState.isValid]);

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
    try {
      setStatus("submitting");

      switch (action) {
        case "send-code": {
          await api.post("/identity/confirm", { ...inputs, sendCode: true });
          setCodeSent(true);
          resendCodeTimer.start();
          toast.success("Security code sent.", { id: toastId });
          break;
        }
        case "validate-code": {
          const response = await api.post("/identity/confirm", inputs);
          setUser(response.data);
          onClose(true);
          break;
        }
      }
    } catch (error) {
      console.error(error);

      const fields = Object.entries<string[]>((isAxiosError(error) ? error?.response?.data?.errors : []) || []);
      fields.forEach(([name, message]) => {
        form.setError(name as any, { message: message?.join("\n") });
      });

      toast.error(getErrorMessage(error), { id: toastId });
    } finally {
      setStatus("idle");
    }
  };

  return (
    <Modal isDismissable={false} isOpen={isOpen} onClose={() => onClose()}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Confirm your account</ModalHeader>
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
                      variant="faded"
                      size="sm"
                      type="button"
                      isLoading={status == "submitting" && form.watch("action") == "send-code"}
                      spinnerPlacement="end"
                      isDisabled={status == "submitting" || resendCodeTimer.isRunning}
                      onPress={() => {
                        form.setValue("action", "send-code");
                        form.handleSubmit(submit)();
                      }}
                    >
                      {status == "submitting" && form.watch("action") == "send-code" ? "Requesting code..." : "Request code"}
                    </Button>
                  }
                />
              )}
            />
            <Button
              className="col-span-12"
              color="primary"
              type="submit"
              isDisabled={status != "idle" || !codeSent}
              isLoading={status == "submitting" && form.watch("action") == "validate-code"}
              onPress={() => {
                form.setValue("action", "validate-code");
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
