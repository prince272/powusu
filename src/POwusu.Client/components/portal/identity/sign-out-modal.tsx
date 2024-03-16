"use client";

import React, { ReactNode, useRef, useState } from "react";
import { useUser } from "@/providers/user/client";
import { getApiResponse } from "@/utils/api";
import { Button } from "@nextui-org/button";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { uniqueId } from "lodash";

import { api } from "@/lib/api";

export interface SignOutModalProps {
  children: ReactNode;
  isOpen: boolean;
  close: () => void;
}

export interface SignOutInputs {}

export const SignOutModal = ({ isOpen, close }: SignOutModalProps) => {
  const toastId = useRef(uniqueId("_toast_")).current;
  const user = useUser();
  const [status, setStatus] = useState<"idle" | "submitting">("idle");

  const signOut = async () => {
    setStatus("submitting");
    await getApiResponse(api.post(`/identity/tokens/revoke`, { token: user?.refreshToken }));
    close();
    api.user.next(null);
  };

  return (
    <Modal
      isDismissable={false}
      isOpen={isOpen}
      onClose={() => {
        close();
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="h-8">Sign out</div>
        </ModalHeader>
        <ModalBody>Are you sure you want to sign out?</ModalBody>
        <ModalFooter className="flex items-center justify-center text-center text-sm">
          <Button
            className="w-full"
            color="default"
            variant="solid"
            onPress={() => {
              close();
            }}
          >
            Cancel
          </Button>
          <Button
            className="w-full"
            color="danger"
            variant="solid"
            isLoading={status === "submitting"}
            onPress={async () => {
              await signOut();
            }}
          >
            Sign out
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
