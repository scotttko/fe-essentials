import React from "react";
import { ReactNode } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  children: ReactNode;
}

function Portal({ children }: PortalProps) {
  const portalRoot = document.getElementById("portal-root");

  if (typeof window === "undefined" || !portalRoot) return <></>;

  return createPortal(<>{children}</>, portalRoot as HTMLElement);
}

export default Portal;
