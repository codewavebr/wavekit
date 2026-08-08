"use client";

import { Toast } from "@heroui/react";

/** App-level toast host. Prefer HeroUI `toast()` helpers for notifications. */
export function Toaster({
  placement = "bottom end",
}: {
  placement?: React.ComponentProps<typeof Toast.Provider>["placement"];
}) {
  return <Toast.Provider placement={placement} />;
}

export { toast, Toast } from "@heroui/react";
