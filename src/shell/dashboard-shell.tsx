"use client";

import type { ReactNode } from "react";

import { ShellHeader } from "./shell-header";
import { ShellMobileNav } from "./shell-mobile-nav";
import { ShellSidebar } from "./shell-sidebar";
import type {
  WaveIconMap,
  WaveLinkComponent,
  WaveNavItem,
  WaveShellBrand,
} from "./types";

type DashboardShellProps = {
  children: ReactNode;
  navItems: WaveNavItem[];
  activePath?: string | null;
  iconMap: WaveIconMap;
  isSidebarMinimized: boolean;
  onSidebarToggle: () => void;
  onMobileNavigate: (href: string) => void;
  LinkComponent?: WaveLinkComponent;
  brand?: WaveShellBrand;
  title: ReactNode;
  subtitle?: ReactNode;
  headerActions?: ReactNode;
};

export function DashboardShell({
  children,
  navItems,
  activePath,
  iconMap,
  isSidebarMinimized,
  onSidebarToggle,
  onMobileNavigate,
  LinkComponent,
  brand,
  title,
  subtitle,
  headerActions,
}: DashboardShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ShellSidebar
        activePath={activePath}
        brand={brand}
        iconMap={iconMap}
        isMinimized={isSidebarMinimized}
        items={navItems}
        LinkComponent={LinkComponent}
        onToggle={onSidebarToggle}
      />
      <ShellMobileNav
        activePath={activePath}
        iconMap={iconMap}
        items={navItems}
        onNavigate={onMobileNavigate}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <ShellHeader title={title} subtitle={subtitle} actions={headerActions} />
        <main className="flex-1 overflow-y-auto bg-background sm:px-4 sm:pb-4">
          {children}
        </main>
      </div>
    </div>
  );
}
