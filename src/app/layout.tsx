import "./global.css";
import { ReactNode } from "react";
import SessionChecker from "@/components/SessionChecker"; // 경로 확인해서 수정 필요

export const metadata = {
  title: "Idam",
  description: "Next.js App Router 기반 프로젝트",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <SessionChecker />
        <main>{children}</main>
      </body>
    </html>
  );
}
