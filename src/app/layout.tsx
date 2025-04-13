import "./global.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Idam",
  description: "Next.js App Router 기반 프로젝트",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
