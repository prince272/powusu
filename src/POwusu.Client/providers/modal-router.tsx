"use client";

import { ComponentType, createContext, ReactNode, use, useCallback, useContext, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useHashState, usePreviousValue, useStateAsync } from "@/hooks";
import { compareSearchParams, sleep } from "@/utils";
import { useDisclosure } from "@heroui/modal";
import PQueue from "p-queue";
import queryString, { StringifiableRecord } from "query-string";

export interface ModalRouterProps {
  children: ReactNode;
  modals: { [key: string]: ComponentType<any> };
}

export interface ModalRouterContextType {
  open: (state: ModalRouterState) => void;
  close: () => void;
}

export interface ModalRouterState {
  key: string;
  Component: ComponentType<any>;
  props?: any;
}

export const ModalRouterContext = createContext<ModalRouterContextType>(undefined!);

export const useModalRouter = () => {
  const context = useContext(ModalRouterContext);
  if (context === undefined) {
    throw new Error("useModalRouter must be used within ModalRouterProvider");
  }
  return context;
};

const EmptyModalComponent = () => <></>;
const emptyModalState = { key: "", Component: EmptyModalComponent } as ModalRouterState;

export const ModalRouterProvider = ({ children, modals }: ModalRouterProps) => {
  const queue = new PQueue({ concurrency: 1 });

  const [{ key, Component: ModalComponent, props: modalComponentProps }, setCurrentModal] = useStateAsync(useState<ModalRouterState>(emptyModalState));

  const searchParams = useSearchParams();

  const modalKey = searchParams.get("modal") || "";
  const modalDisclosureProps = useDisclosure();

  const open = useCallback((state: ModalRouterState) => {
    return queue.add(async () => {
      const currentModal = await new Promise<ModalRouterState>((resolve) => {
        setCurrentModal((modal) => {
          resolve(modal);
          return modal;
        });
      });

      if (currentModal.key) {
        modalDisclosureProps.onClose();
        await sleep(100);
        await setCurrentModal(emptyModalState);
      }

      const nextModal = state;

      if (nextModal.key) {
        await setCurrentModal(nextModal);
        modalDisclosureProps.onOpen();
      }
    });
  }, []);

  const close = useCallback(() => {
    open(emptyModalState);
  }, []);

  useEffect(() => {
    open({ key: modalKey, Component: modals[modalKey] });
  }, [modalKey]);

  return (
    <ModalRouterContext.Provider value={{ open, close }}>
      {children}
      <ModalComponent {...{ ...modalComponentProps, isOpen: modalDisclosureProps.isOpen, open, close }} />
    </ModalRouterContext.Provider>
  );
};
