import DashboardWrapper from "@/components/shared/DashboardWrapper";
import { ReactNode, Suspense } from "react";

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
