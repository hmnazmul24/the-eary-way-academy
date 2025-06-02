"use client";

const RootFooter = dynamic(() => import("@/components/shared/RootFooter"), {
  ssr: false,
});
const RootNavbar = dynamic(() => import("@/components/shared/RootNavbar"), {
  ssr: false,
});
import dynamic from "next/dynamic";
import React, { ReactNode, Suspense } from "react";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Suspense fallback={<div>Home page Loading...</div>}>
        <RootNavbar />
        <div className="min-h-screen max-w-screen-2xl m-auto">{children}</div>
        <RootFooter />
      </Suspense>
    </div>
  );
};

export default RootLayout;
