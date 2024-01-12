import { ComponentType, createContext, FC, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useHashState, usePreviousValue, useStateAsync } from "@/hooks";
import { sleep } from "@/utils";
import { useDisclosure } from "@nextui-org/modal";
import PQueue from "p-queue";

export interface ModalRouterProps {
  children: ReactNode;
  modals: { [key: string]: ComponentType<any> };
}

export interface ModalRouterContextType {}

export interface ModalRouterState {
  key: string;
  Component: ComponentType<any>;
  metadata?: any;
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
const emptyModal = { key: "", Component: EmptyModalComponent };

export const ModalRouterProvider: FC<ModalRouterProps> = ({ children, modals }) => {
  const queue = new PQueue({ concurrency: 1 });

  const [{ key: currentKey, Component: CurrentModalComponent, metadata: currentMetadata }, setCurrentModal] = useStateAsync(useState<ModalRouterState>(emptyModal));

  const router = useRouter();
  const [hash, setHash] = useHashState();
  const currentUrl = useMemo(() => () => (typeof window !== "undefined" ? window.location.href : ""), [])();
  const previousUrl = usePreviousValue(currentUrl, () => !!hash || hash != "sign-in") || "/";

  const modalProps = useDisclosure();

  useEffect(() => {
    queue.add(async () => {
      const nextModal = modals[hash]
        ? {
            key: hash,
            Component: modals[hash],
            metadata: { url: currentUrl, previousUrl }
          }
        : emptyModal;

      const currentModal = await new Promise<ModalRouterState>((resolve) => {
        setCurrentModal((modal) => {
          const newModal = { ...modal, metadata: modal.metadata ? { ...modal.metadata, canReturn: !nextModal } : modal.metadata };
          resolve(newModal);
          return newModal;
        });
      });

      if (currentModal.key) {
        modalProps.onClose();
        await sleep(300);
        await setCurrentModal(emptyModal);
      }

      if (nextModal.key) {
        await setCurrentModal(nextModal);
        modalProps.onOpen();
        await sleep(300);
      }
    });
  }, [hash]);

  return (
    <ModalRouterContext.Provider value={{}}>
      {children}
      <CurrentModalComponent
        {...{
          ...modalProps,
          onOpenChange: () => {
            if (modalProps.isOpen) router.push(previousUrl);
            modalProps.onOpenChange();
          },
          onClose: () => {
            router.push(previousUrl);
          }
        }}
      />
    </ModalRouterContext.Provider>
  );
};
