"use client";

import React, { Key, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import NextLink from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useBreakpoint } from "@/hooks";
import { useUser } from "@/providers/user/client";
import { cn } from "@/utils";
import { getErrorMessage } from "@/utils/api";
import { ChevronLeftRegular, PasswordRegular, PeopleSwapFilled, PeopleSwapRegular, PersonRegular, SettingsRegular } from "@fluentui/react-icons";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { isAxiosError } from "axios";
import { clone, create, set, uniqueId } from "lodash";
import queryString from "query-string";
import { Controller as FormController, SubmitHandler, useForm } from "react-hook-form";
import Sticky from "react-stickynode";
import { useTimer } from "react-timer-hook";

import { api } from "@/lib/api";
import { useRouter } from "@/hooks/use-router";
import { toast } from "@/components/ui/toaster";

import { PasswordInput } from "../ui/password-input";
import { Portal } from "../ui/portal";
import { Render } from "../ui/render";

export interface SettingsModalProps {
  children: ReactNode;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export interface SettingsInputs {}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { user: currentUser } = useUser();
  const passwordCreated = currentUser?.passwordCreated;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl = queryString.stringifyUrl({ url: pathname, query: Object.fromEntries(searchParams) });
  const defaultKey = "edit-profile";
  const [selectedKey, setSelectedKey] = useState<Key | null | undefined>(defaultKey);
  const isMd = useBreakpoint("sm", "up");
  const footerId = useRef(uniqueId("_footer_")).current;

  useEffect(() => {
    if (isMd && !selectedKey) {
      setSelectedKey(defaultKey);
    }
  }, [isMd, selectedKey]);

  return (
    <Modal
      isDismissable={false}
      isOpen={isOpen}
      onClose={() => {
        onClose();
        router.replace(pathname);
      }}
      classNames={{ base: "min-h-[640px]" }}
      size={"2xl"}
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex h-8 items-center space-x-1">
            <Button
              size="sm"
              variant="light"
              isIconOnly
              onPress={() => {
                if (!isMd) setSelectedKey(null);
              }}
            >
              <span className={cn(selectedKey ? "sm:hidden" : "hidden")}>
                <ChevronLeftRegular fontSize={20} />
              </span>
              <span className={cn(selectedKey ? "hidden sm:block" : "")}>
                <SettingsRegular fontSize={20} />
              </span>
            </Button>
            <div>Settings</div>
          </div>
        </ModalHeader>
        <ModalBody className="flex flex-row gap-6 py-0 sm:pl-3 sm:pr-6">
          <div className={cn("sticky top-0", selectedKey ? "hidden sm:block" : "w-full")}>
            <div className="grid items-start gap-x-2 gap-y-3 sm:w-56">
              {[
                { key: "edit-profile", label: <>Edit profile</>, icon: <PersonRegular fontSize={24} /> },
                { key: "change-account", label: <>Change account</>, icon: <PeopleSwapRegular fontSize={24} /> },
                { key: "change-password", label: <>{passwordCreated ? "Change password" : "Create password"}</>, icon: <PasswordRegular fontSize={24} /> }
              ].map((item) => (
                <Button
                  key={item.key}
                  variant={item.key == selectedKey ? "flat" : "light"}
                  color={item.key == selectedKey ? "primary" : "default"}
                  className="justify-start"
                  startContent={item.icon}
                  onPress={() => setSelectedKey(item.key)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
          <div className={cn(selectedKey ? "w-full" : "hidden sm:block")}>
            <Render switch={selectedKey}>
              <EditProfileView key="edit-profile" footerId={footerId} />
              <ChangePasswordView key="change-password" footerId={footerId} />
            </Render>
          </div>
        </ModalBody>
        <ModalFooter id={footerId} className="flex items-center justify-end text-center text-sm"></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

interface EditProfileInputs {
  firstName: string;
  lastName: string;
}

const EditProfileView = ({ footerId }: { footerId: string }) => {
  const { user: currentUser } = useUser();
  const form = useForm<EditProfileInputs>({
    defaultValues: {
      firstName: currentUser?.firstName,
      lastName: currentUser?.lastName
    }
  });
  const formErrors = useMemo(() => clone(form.formState.errors), [form.formState.isSubmitting, form.formState.isValid]);
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const toastId = useRef(uniqueId("_toast_")).current;

  const submit: SubmitHandler<EditProfileInputs> = async (inputs) => {
    try {
      setStatus("submitting");

      const response = await api.post("/identity/edit-profile", inputs);
      api.user.next(response.data);
      toast.success("Profile updated.", { id: toastId });
    } catch (error) {
      console.error(error);

      const fields = Object.entries<string[]>(isAxiosError(error) ? error?.response?.data?.errors || {} : {});
      fields.forEach(([name, message]) => {
        form.setError(name as any, { message: message?.join("\n") });
      });

      toast.error(getErrorMessage(error), { id: toastId });
    } finally {
      setStatus("idle");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(submit)} className="grid grid-cols-12 gap-3">
      <FormController
        control={form.control}
        name="firstName"
        render={({ field }) => (
          <Input
            {...field}
            className="col-span-6"
            placeholder="First name"
            labelPlacement="outside"
            label="First name"
            isInvalid={!!formErrors.firstName}
            errorMessage={formErrors.firstName?.message}
          />
        )}
      />
      <FormController
        control={form.control}
        name="lastName"
        render={({ field }) => (
          <Input
            {...field}
            className="col-span-6"
            placeholder="First name"
            labelPlacement="outside"
            label="Last name"
            isInvalid={!!formErrors.lastName}
            errorMessage={formErrors.lastName?.message}
          />
        )}
      />
      <Portal rootId={footerId}>
        <Button
          className="w-full sm:w-auto"
          color="primary"
          type="button"
          variant="solid"
          isDisabled={status != "idle"}
          isLoading={status == "submitting"}
          onPress={() => form.handleSubmit(submit)()}
        >
          Save changes
        </Button>
      </Portal>
    </form>
  );
};

interface ChangePasswordInputs {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePasswordView = ({ footerId }: { footerId: string }) => {
  const { user: currentUser } = useUser();
  const passwordCreated = currentUser?.passwordCreated;
  const form = useForm<ChangePasswordInputs>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });
  const formErrors = useMemo(() => clone(form.formState.errors), [form.formState.isSubmitting, form.formState.isValid]);
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const toastId = useRef(uniqueId("_toast_")).current;

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl = queryString.stringifyUrl({ url: pathname, query: Object.fromEntries(searchParams) });

  const submit: SubmitHandler<ChangePasswordInputs> = async (inputs) => {
    try {
      setStatus("submitting");

      await api.post(`/identity/password/${!passwordCreated ? "create" : "change"}`, inputs);
      form.reset();
      toast.success("Password changed.", { id: toastId });
    } catch (error) {
      console.error(error);

      const fields = Object.entries<string[]>(isAxiosError(error) ? error?.response?.data?.errors || {} : {});
      fields.forEach(([name, message]) => {
        form.setError(name as any, { message: message?.join("\n") });
      });

      toast.error(getErrorMessage(error), { id: toastId });
    } finally {
      setStatus("idle");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(submit)} className="grid grid-cols-12 gap-6">
      {passwordCreated && (
        <FormController
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <div className="col-span-12">
              <PasswordInput
                {...field}
                placeholder="Current password"
                labelPlacement="outside"
                label="Current password"
                isInvalid={!!formErrors.currentPassword}
                errorMessage={formErrors.currentPassword?.message}
              />
              <div className="flex justify-end px-1 py-2">
                <Link
                  as={NextLink}
                  href={queryString.stringifyUrl({
                    url: currentUrl,
                    query: { modal: "reset-password" }
                  })}
                  size="sm"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
          )}
        />
      )}
      <FormController
        control={form.control}
        name="newPassword"
        render={({ field }) => (
          <PasswordInput
            {...field}
            className="col-span-12"
            placeholder="New password"
            labelPlacement="outside"
            label="New password"
            isInvalid={!!formErrors.newPassword}
            errorMessage={formErrors.newPassword?.message}
          />
        )}
      />
      <FormController
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <PasswordInput
            {...field}
            className="col-span-12"
            placeholder="Confirm password"
            labelPlacement="outside"
            label="Confirm password"
            isInvalid={!!formErrors.confirmPassword}
            errorMessage={formErrors.confirmPassword?.message}
          />
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
        {!passwordCreated ? "Create password" : "Change password"}
      </Button>
    </form>
  );
};
