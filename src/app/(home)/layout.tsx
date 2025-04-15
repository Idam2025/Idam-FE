import NavigationBar from "@/components/navigationbar/Home/mainNavigationBar";
import { ReactNode, Suspense } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <NavigationBar />

      {children}
    </div>
  );
}
