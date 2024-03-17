"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTimeout } from "@/hooks";
import { useUser } from "@/providers/user/client";
import SolarBellBoldDuotone from "@iconify/icons-solar/bell-bold-duotone";
import { Button } from "@nextui-org/button";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/modal";
import { uniqueId } from "lodash";

import { pushNotification, PushNotificationError } from "@/lib/push-notification";
import { useLocalState } from "@/hooks/use-storage-state";
import { Icon } from "@/components/ui/icon";

import { toast } from "./toaster";

export const AutoPushNotificationModal = () => {
  const timeoutValues = useRef<number[]>([10000, 300000, 1200000]).current; // 10s, 5m, 20m
  const [timeoutIndex, setTimeoutIndex] = useLocalState("autoPushNotificationModalTimeoutIndex", 0);
  const timeout = useTimeout();

  const toastId = useRef(uniqueId("_toast_")).current;
  const [status, setStatus] = useState<"idle" | "subscribing">("idle");
  const { isOpen, onOpen: open, onOpenChange, onClose: close } = useDisclosure();

  const user = useUser();

  const subscribeToPushNotification = async () => {
    setStatus("subscribing");

    try {
      await pushNotification.subscribe(true);
      toast.success("Push notification successful.", { id: toastId });
    } catch (error) {
      if (error instanceof PushNotificationError && error.reason == "PERMISSION_DENIED") {
        toast.error("Permission denied to send push notification.", { id: toastId });
      } else if (error instanceof PushNotificationError && error.reason == "PERMISSION_CANCELLED") {
        toast.error("Permission cancelled to send push notification.", { id: toastId });
      }
    }

    close();
  };

  const handleSkipForNow = () => {
    const nextIndex = timeoutIndex === timeoutValues.length - 1 ? timeoutValues.length - 1 : timeoutIndex + 1;
    setTimeoutIndex(nextIndex);
    close();
  };

  useEffect(() => {
    return pushNotification.watch();
  }, [!!user]);

  useEffect(() => {
    if (pushNotification.permission == "granted" || pushNotification.permission == "denied") {
      return;
    }

    timeout.set(() => {
      if (pushNotification.permission == "granted" || pushNotification.permission == "denied") {
        return;
      }
      open();
    }, timeoutValues[timeoutIndex]);

    return () => {
      timeout.clear();
    };
  }, [timeoutIndex]);

  return (
    <Modal
      hideCloseButton
      isDismissable={false}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={() => {
        close();
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="h-8">Push notifications</div>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col items-center justify-center space-y-3 text-center">
            <div className="relative">
              <div className="absolute right-0 top-0 mr-3 mt-1 flex h-3 w-3">
                <div className="relative flex h-3 w-3">
                  <div className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-75"></div>
                  <div className="relative inline-flex h-3 w-3 rounded-full bg-danger"></div>
                </div>
              </div>

              <div>
                <Icon icon={SolarBellBoldDuotone} width="94" height="94" className="text-primary" />
              </div>
            </div>
            <div>I&apos;d like to send you notifications when I publish something new.</div>
          </div>
        </ModalBody>
        <ModalFooter className="flex flex-col items-center justify-center gap-4 text-center text-sm md:flex-row">
          <Button
            className="order-2 w-full md:order-none"
            color="default"
            variant="solid"
            onPress={() => {
              handleSkipForNow();
            }}
          >
            Skip for now
          </Button>
          <Button
            className="order-1 w-full md:order-none"
            color="primary"
            variant="solid"
            isLoading={status === "subscribing"}
            onPress={async () => {
              await subscribeToPushNotification();
            }}
          >
            Subscribe
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
