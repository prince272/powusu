"use client";

import { ComponentType, createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useHashState, usePreviousValue, useStateAsync } from "@/hooks";
import { compareSearchParams, sleep } from "@/utils";
import { useDisclosure } from "@nextui-org/modal";
import PQueue from "p-queue";
import queryString, { StringifiableRecord } from "query-string";

export interface ModalRouterProps {
  children: ReactNode;
  modals: { [key: string]: ComponentType<any> };
}

export interface ModalRouterContextType {}

export interface ModalRouterState {
  key: string;
  Component: ComponentType<any>;
}

export const ModalRouterContext = createContext<ModalRouterContextType>(undefined!);

export const useModalRouter = () => {
  const context = useContext(ModalRouterContext);
  if (context === undefined) {
    throw new Error("useModalRouter must be used within ModalRouterProvider");
  }
  return context;
};

const EmptyModalComponent: FC<any> = () => <></>;
const emptyModal = { key: "", Component: EmptyModalComponent } as ModalRouterState;

export const ModalRouterProvider: FC<ModalRouterProps> = ({ children, modals }) => {
  const queue = new PQueue({ concurrency: 1 });

  const [{ key, Component: ModalComponent }, setCurrentModal] = useStateAsync(useState<ModalRouterState>(emptyModal));

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const modalKey = searchParams.get("modal") || "";
  const modalProps = useDisclosure();

  useEffect(() => {
    queue.add(async () => {
      const currentModal = await new Promise<ModalRouterState>((resolve) => {
        setCurrentModal((modal) => {
          resolve(modal);
          return modal;
        });
      });

      if (currentModal.key) {
        modalProps.onClose();
        await sleep(300);
        await setCurrentModal(emptyModal);
      }

      const nextModal =
        {
          key: modals[modalKey] ? modalKey : "",
          Component: modals[modalKey]
        } || emptyModal;

      if (nextModal.key) {
        await setCurrentModal(nextModal);
        modalProps.onOpen();
      }
    });
  }, [modalKey]);

  return (
    <ModalRouterContext.Provider value={{}}>
      {children}
      <ModalComponent
        {...{
          ...modalProps,
          onClose: (submitted: boolean) => {
            if (submitted) {
              const href = searchParams.get("callback") || pathname;
              router.replace(href);
            } else {
              router.replace(pathname);
            }

            modalProps.onClose();
          }
        }}
      />
    </ModalRouterContext.Provider>
  );
};