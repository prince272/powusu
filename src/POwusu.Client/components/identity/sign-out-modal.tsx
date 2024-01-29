"use client";

import React, { ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/providers/user/client";
import { Button } from "@nextui-org/button";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import queryString from "query-string";
import { api } from "@/lib/api";

export interface SignOutModalProps {
  children: ReactNode;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export interface SignOutInputs {}

export const SignOutModal = ({ isOpen, onClose } : SignOutModalProps) => {
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
        <ModalHeader className="flex flex-col gap-1">
          <div className="h-8">Sign out</div>
        </ModalHeader>
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
              api.user.next(null);
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
