"use client";

import React, { Key, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useBreakpoint, useCurrentValue, usePreviousValue } from "@/hooks";
import { useUser } from "@/providers/user/client";
import { cn } from "@/utils";
import { getApiResponse, getErrorTitle } from "@/utils/api";
import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { Tab, Tabs } from "@nextui-org/tabs";
import { isAxiosError } from "axios";
import { clone, cloneDeep, create, set, uniqueId } from "lodash";
import { parseAsString, useQueryState } from "nuqs";
import queryString from "query-string";
import { Controller as FormController, SubmitHandler, useForm } from "react-hook-form";
import { useTimer } from "react-timer-hook";

import { api } from "@/lib/api";
import { Link as NextLink } from "@/components/ui/navigation";
import { toast } from "@/components/ui/toaster";

import { FileInput } from "../ui/file-input";
import { PasswordInput } from "../ui/password-input";
import { Portal } from "../ui/portal";
import { Switch } from "../ui/render";

export interface SettingsModalProps {
  children: ReactNode;
  isOpen: boolean;
}

export interface SettingsInputs {}

export const SettingsModal = ({ isOpen }: SettingsModalProps) => {
  const currentUser = useUser();
  const hasPassword = currentUser?.hasPassword;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl = queryString.stringifyUrl({ url: pathname, query: Object.fromEntries(searchParams) });
  const [selectedKey, setSelectedKey] = useQueryState("view", parseAsString.withOptions({ shallow: false }));
  const footerId = useRef(uniqueId("_footer_")).current;

  const sm = useBreakpoint({ sm: "up" });
  return (
    <Modal
      isDismissable={false}
      isOpen={isOpen}
      onClose={() => {
        router.push(searchParams.get("callback") || pathname);
      }}
      classNames={{ base: "min-h-[640px]" }}
      size="2xl"
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
                setSelectedKey(null);
              }}
            >
              <span className={cn(selectedKey ? "sm:hidden" : "hidden")}>
                <Icon icon="solar:alt-arrow-left-outline" width="24" height="24" />
              </span>
              <span className={cn(selectedKey ? "hidden sm:block" : "")}>
                <Icon icon="solar:settings-bold" width="24" height="24" />
              </span>
            </Button>
            <div>Settings</div>
          </div>
        </ModalHeader>
        <ModalBody className={cn("flex flex-row gap-0 p-0")}>
          <div className={cn("sticky top-0 w-full pl-3 pr-3 sm:w-auto", selectedKey ? "hidden sm:block" : "")}>
            <div className="grid items-start gap-x-2 gap-y-3 sm:w-56">
              {[
                { key: "edit-profile", label: <>Edit profile</>, icon: <Icon icon="solar:user-bold" width="24" height="24" /> },
                { key: "change-account", label: <>Change account</>, icon: <Icon icon="solar:users-group-rounded-bold" width="24" height="24" /> },
                { key: "change-password", label: <>{hasPassword ? "Change password" : "Create password"}</>, icon: <Icon icon="solar:lock-keyhole-bold" width="24" height="24" /> }
              ].map((item) => (
                <Button
                  key={item.key}
                  variant={(selectedKey ? item.key == selectedKey : item.key == "edit-profile" && sm) ? "flat" : "light"}
                  color={(selectedKey ? item.key == selectedKey : item.key == "edit-profile" && sm) ? "primary" : "default"}
                  className="justify-start"
                  startContent={item.icon}
                  onPress={() => setSelectedKey(item.key)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
          <div className={cn("w-full px-6 sm:pl-3 sm:pr-6", selectedKey ? "" : "hidden sm:block")}>
            <Switch switch={selectedKey || "edit-profile"}>
              <EditProfileView key="edit-profile" footerId={footerId} />
              <ChangeAccountTabs key="change-account" footerId={footerId} />
              <ChangePasswordView key="change-password" footerId={footerId} />
            </Switch>
          </div>
        </ModalBody>
        <ModalFooter id={footerId} className={cn("w-full items-center justify-end text-center text-sm", selectedKey ? "" : "hidden sm:flex")}></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

interface EditProfileInputs {
  imageId: string;
  firstName: string;
  lastName: string;
  bio: string;
}

const EditProfileView = ({ footerId }: { footerId: string }) => {
  const currentUser = useUser();
  const form = useForm<EditProfileInputs>({
    defaultValues: {
      imageId: currentUser?.imageId,
      firstName: currentUser?.firstName || "",
      lastName: currentUser?.lastName || "",
      bio: currentUser?.bio || ""
    }
  });
  const formErrors = useCurrentValue(cloneDeep(form.formState.errors), () => form.formState.isSubmitting);
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const toastId = useRef(uniqueId("_toast_")).current;

  const submit: SubmitHandler<EditProfileInputs> = async (inputs) => {
    setStatus("submitting");

    const { data: nextUser, error } = await getApiResponse(api.put("/identity/profile", inputs));

    if (error) {
      error.fields.forEach(([name, message]) => {
        form.setError(name as any, { message: message?.join("\n") });
      });

      setStatus("idle");
      toast.error(error.title, { id: toastId });
      return;
    }

    api.user.next(nextUser);
    setStatus("idle");
    toast.success("Profile updated.", { id: toastId });
  };

  return (
    <form onSubmit={form.handleSubmit(submit)} className="grid grid-cols-12 gap-6">
      <FormController
        control={form.control}
        name="imageId"
        render={({ field }) => (
          <div className="col-span-12 flex items-center justify-center">
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
              className="h-44 w-44"
              variant="circle"
              endpoint="/identity/profile/images"
            />
          </div>
        )}
      />
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
            placeholder="Last name"
            labelPlacement="outside"
            label="Last name"
            isInvalid={!!formErrors.lastName}
            errorMessage={formErrors.lastName?.message}
          />
        )}
      />
      <FormController
        control={form.control}
        name="bio"
        render={({ field }) => (
          <Textarea {...field} className="col-span-12" maxRows={3} label="Bio" placeholder="Enter your bio" isInvalid={!!formErrors.bio} errorMessage={formErrors.bio?.message} />
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

interface ChangeAccountInputs {
  action: "sendCode" | "validateCode";
  currentEmail: string;
  newEmail: string;
  currentPhoneNumber: string;
  newPhoneNumber: string;
  code: string;
}

const ChangeAccountTabs = ({ footerId }: { footerId: string }) => {
  const isSm = useBreakpoint("sm", "up");
  const [contactType, setContactType] = useState<Key>("email");

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <Tabs
          aria-label="Options"
          color="primary"
          classNames={{ base: "justify-center w-full pb-6", tabList: "min-w-[256px]" }}
          fullWidth={!isSm}
          size="sm"
          selectedKey={contactType}
          onSelectionChange={setContactType}
        >
          <Tab key="email" title="Email">
            <ChangeEmailView />
          </Tab>
          <Tab key="phoneNumber" title="Phone number">
            <ChangePhoneNumberView />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

const createChangeAccountView = (contactType: "email" | "phoneNumber") => {
  const ChangeAccountView = () => {
    const currentUser = useUser();

    const toastId = useRef(uniqueId("_toast_")).current;

    const form = useForm<ChangeAccountInputs>({
      defaultValues: {
        action: "sendCode",
        ...{
          email: {
            currentEmail: currentUser?.email || "",
            newEmail: ""
          },
          phoneNumber: {
            currentPhoneNumber: currentUser?.phoneNumber || "",
            newPhoneNumber: ""
          }
        }[contactType],
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

    const submit: SubmitHandler<ChangeAccountInputs> = async ({ action, ...inputs }) => {
      setStatus("submitting");

      switch (action) {
        case "sendCode": {
          const { error } = await getApiResponse(api.post(`/identity/${{ email: "email", phoneNumber: "phone-number" }[contactType]}/change`, { ...inputs, sendCode: true }));

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
          const { data: nextUser, error } = await getApiResponse(api.post(`/identity/${{ email: "email", phoneNumber: "phone-number" }[contactType]}/change`, inputs));

          if (error) {
            error.fields.forEach(([name, message]) => {
              form.setError(name as any, { message: message?.join("\n") });
            });

            setStatus("idle");
            toast.error(error.title, { id: toastId });
            return;
          }

          api.user.next(nextUser);
          form.reset({
            action: "sendCode",
            ...{
              email: {
                currentEmail: nextUser?.email,
                newEmail: ""
              },
              phoneNumber: {
                currentPhoneNumber: nextUser?.phoneNumber,
                newPhoneNumber: ""
              }
            }[contactType],
            code: ""
          });
          setStatus("idle");
          toast.success("Account updated successfully.", { id: toastId });
          break;
        }
      }
    };

    return (
      <form className="grid grid-cols-12 gap-y-5" onSubmit={form.handleSubmit(submit)}>
        {form.watch({ email: "currentEmail", phoneNumber: "currentPhoneNumber" }[contactType] as "currentEmail" | "currentPhoneNumber") && (
          <FormController
            control={form.control}
            name={{ email: "currentEmail", phoneNumber: "currentPhoneNumber" }[contactType] as "currentEmail" | "currentPhoneNumber"}
            render={({ field }) => (
              <Input
                {...field}
                className="col-span-12"
                labelPlacement="outside"
                label={{ email: "Current email", phoneNumber: "Current phone number" }[contactType]}
                placeholder={{ email: "Current email", phoneNumber: "Current phone number" }[contactType]}
                isInvalid={!!formErrors[{ email: "currentEmail", phoneNumber: "currentPhoneNumber" }[contactType] as "currentEmail" | "currentPhoneNumber"]}
                errorMessage={formErrors[{ email: "currentEmail", phoneNumber: "currentPhoneNumber" }[contactType] as "currentEmail" | "currentPhoneNumber"]?.message}
                isReadOnly
              />
            )}
          />
        )}
        <FormController
          control={form.control}
          name={{ email: "newEmail", phoneNumber: "newPhoneNumber" }[contactType] as "newEmail" | "newPhoneNumber"}
          render={({ field }) => (
            <Input
              {...field}
              className="col-span-12"
              labelPlacement="outside"
              label={{ email: "New email", phoneNumber: "New phone number" }[contactType]}
              placeholder={{ email: "New email", phoneNumber: "New phone number" }[contactType]}
              isInvalid={!!formErrors[{ email: "newEmail", phoneNumber: "newPhoneNumber" }[contactType] as "newEmail" | "newPhoneNumber"]}
              errorMessage={formErrors[{ email: "newEmail", phoneNumber: "newPhoneNumber" }[contactType] as "newEmail" | "newPhoneNumber"]?.message}
            />
          )}
        />
        <FormController
          control={form.control}
          name="code"
          render={({ field }) => (
            <Input
              {...field}
              className="col-span-12"
              labelPlacement="outside"
              label="Enter code"
              placeholder="Enter code"
              description={
                <span className="text-primary-400">
                  {resendCodeTimer.isRunning
                    ? `You can request the code again in ${resendCodeTimer.seconds}s.`
                    : codeSent
                      ? `Enter the code that was sent to your new ${{ email: "email address", phoneNumber: "phone number" }[contactType]}.`
                      : `Request a code to be sent to your new ${{ email: "email address", phoneNumber: "phone number" }[contactType]}.`}
                </span>
              }
              isInvalid={!!formErrors.code}
              errorMessage={formErrors.code?.message}
              endContent={
                <Button
                  className="-mr-2 px-7"
                  color="default"
                  variant="flat"
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
          {form.watch({ email: "currentEmail", phoneNumber: "currentPhoneNumber" }[contactType] as "currentEmail" | "currentPhoneNumber") ? "Change" : "Add"}{" "}
          {{ email: "email", phoneNumber: "phone number" }[contactType]}
        </Button>
      </form>
    );
  };

  return ChangeAccountView;
};

const ChangeEmailView = createChangeAccountView("email");
const ChangePhoneNumberView = createChangeAccountView("phoneNumber");

interface ChangePasswordInputs {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePasswordView = ({ footerId }: { footerId: string }) => {
  const currentUser = useUser();
  const hasPassword = currentUser?.hasPassword;
  const form = useForm<ChangePasswordInputs>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });
  const formErrors = useCurrentValue(cloneDeep(form.formState.errors), () => form.formState.isSubmitting);
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const toastId = useRef(uniqueId("_toast_")).current;

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl = queryString.stringifyUrl({ url: pathname, query: Object.fromEntries(searchParams) });

  const submit: SubmitHandler<ChangePasswordInputs> = async (inputs) => {
    setStatus("submitting");

    const { data: nextUser, error } = await getApiResponse(api.post(`/identity/password/${!hasPassword ? "create" : "change"}`, inputs));

    if (error) {
      error.fields.forEach(([name, message]) => {
        form.setError(name as any, { message: message?.join("\n") });
      });

      setStatus("idle");
      toast.error(error.title, { id: toastId });
      return;
    }

    api.user.next(nextUser);
    form.reset();
    setStatus("idle");
    toast.success("Password changed.", { id: toastId });
  };

  return (
    <form onSubmit={form.handleSubmit(submit)} className="grid grid-cols-12 gap-6">
      {hasPassword && (
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
                    query: { modal: "reset-password", callback: currentUrl }
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
        {!hasPassword ? "Create password" : "Change password"}
      </Button>
    </form>
  );
};
