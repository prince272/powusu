import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  rootId: string;
  children: ReactNode;
}

export const Portal = ({ rootId, children } : PortalProps) => {
  const [target, setTarget] = useState<HTMLElement | null>(() => document.getElementById(rootId));

  useEffect(() => {

    setTarget( document.getElementById(rootId));

    const cleanup = () => {
      window.requestAnimationFrame(() => {
        if (target && target.childNodes.length === 0) {
          // remove all child nodes
          while (target.firstChild) {
            target.removeChild(target.firstChild);
          }
          setTarget(null);
        }
      });
    };

    // Cleanup when the component is unmounted
    return cleanup;
  }, [rootId]);

  // Render the portal
  return target ? createPortal(children, target) : null;
};
