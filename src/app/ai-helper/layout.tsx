"use client";

import NavigationBar from "@/components/navigationbar/Home/mainNavigationBar";
import { usePathname } from "next/navigation";

import { ReactNode, Suspense } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const hideNavbar = pathname.startsWith("/ai-helper/next");

  return (
    <div>
      {!hideNavbar && (
        <Suspense fallback={<div>loading...</div>}>
          <NavigationBar />
        </Suspense>
      )}
      {children}
    </div>
  );
}
