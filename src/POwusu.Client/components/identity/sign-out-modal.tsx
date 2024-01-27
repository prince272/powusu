"use client";

import React, { FC, ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/providers/user/client";
import { Button } from "@nextui-org/button";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import queryString from "query-string";

export interface SignOutModalProps {
  children: ReactNode;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export interface SignOutInputs {}

export const SignOutModal: FC<SignOutModalProps> = ({ isOpen, onClose }) => {
  const { user: currentUser, removeUser } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
        <ModalHeader className="flex flex-col gap-1">Sign out</ModalHeader>
        <ModalBody>Are you sure you want to sign out?</ModalBody>
        <ModalFooter className="flex items-center justify-center text-center text-sm">
          <Button
            className="w-full"
            color="default"
            variant="solid"
            onClick={() => {
              onClose();
              router.replace(pathname);
            }}
          >
            Cancel
          </Button>
          <Button
            className="w-full"
            color="danger"
            variant="solid"
            onClick={async () => {
              removeUser();
              onClose();
              router.replace(searchParams.get("callback") || pathname);
            }}
          >
            Sign out
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
