"use client";

import { getAllBranches } from "@/actions/branch";
import { BranchesTableType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { Fragment } from "react";

const BranchTable = dynamic(
  () => import("@/components/admin/branches/BranchTable"),
  {
    ssr: false,
  }
);

const BranchesPage = () => {
  const { isPending, data } = useQuery({
    queryKey: ["branches"],
    queryFn: async () => await getAllBranches(),
  });

  if (isPending) {
    return <div>loading....</div>;
  }

  const tableDataFn = (): BranchesTableType[] => {
    let info: BranchesTableType[] = [];
    if (data) {
      data?.branches?.forEach((e) => {
        info.push({
          id: e.id,
          district: e.moreInfo?.district!,
          insAge: e.branchInfo?.instituteAge!,
          mobile: e.branchInfo?.branchMobile!,
          name: e.personalInfo?.fullName!,
          noOfCom: e.branchInfo?.noOfComputers!,
          picture: e.ppSizePhoto?.secure_url!,
          varified: e.isVarified,
        });
      });
    }
    return info;
  };

  return (
    <Fragment>
      {data && (
        <div>
          <BranchTable data={tableDataFn()} />
        </div>
      )}
    </Fragment>
  );
};

export default BranchesPage;
