"use client";

import dynamic from "next/dynamic";
import { ReactNode, Suspense } from "react";
const DashboardWrapper = dynamic(
  () => import("@/components/shared/DashboardWrapper"),
  { ssr: false }
);

const BranchLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Suspense fallback={<div>Loading Branch...</div>}>
        <DashboardWrapper>
          <div className="md:px-6 md:py-6 min-h-screen  bg-stone-100">
            {children}
          </div>
        </DashboardWrapper>
      </Suspense>
    </div>
  );
};

export default BranchLayout;
