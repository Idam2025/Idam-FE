import SearchBar from "@/components/searchbar/ai-helper/ai-searchbar";
import { ReactNode, Suspense } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Suspense fallback={<div>loading...</div>}>
        <SearchBar />
      </Suspense>
      {children}
    </div>
  );
}
