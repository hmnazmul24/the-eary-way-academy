import dynamic from "next/dynamic";

const AdminDashboardWrapper = dynamic(
  () => import("@/components/admin/AdminDashboardWrapper"),
  { ssr: false }
);

import React, { ReactNode, Suspense } from "react";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense fallback={<div>Admin Loading...</div>}>
      <AdminDashboardWrapper>
        <div className="md:px-6 md:py-3 min-h-screen  bg-stone-100">
          {children}
        </div>
      </AdminDashboardWrapper>
    </Suspense>
  );
};

export default AdminLayout;
