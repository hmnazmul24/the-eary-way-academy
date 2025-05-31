import RootFooter from "@/components/shared/RootFooter";
import RootNavbar from "@/components/shared/RootNavbar";
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
