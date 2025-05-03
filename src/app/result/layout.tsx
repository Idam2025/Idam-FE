import React, { Suspense } from "react";

export default function Layout({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile: React.ReactNode;
}) {
  return (
    <>
      <main>{children}</main>
      <Suspense fallback={null}>{profile}</Suspense>
    </>
  );
}
