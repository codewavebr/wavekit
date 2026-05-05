import type { ComponentType, ReactNode } from "react";

export type WaveNavItem = {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: string;
  label?: string;
  description?: string;
  position?: "top" | "bottom";
  items?: WaveNavItem[];
};

export type WaveShellUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export type WaveIconProps = {
  className?: string;
  color?: string;
  size?: number;
};

export type WaveIconMap = Record<string, ComponentType<WaveIconProps>>;

export type WaveLinkComponentProps = {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
};

export type WaveLinkComponent = ComponentType<WaveLinkComponentProps>;

export type WaveShellSlots = {
  headerActions?: ReactNode;
  userMenu?: ReactNode;
  mobileActions?: ReactNode;
};
