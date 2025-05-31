"use client";

import { GetBranchWithoutIdAction } from "@/actions/branchOwner";
import BranchInfo from "@/components/branch/profile/MyBranchInfo";
import { useQuery } from "@tanstack/react-query";

const BranchProfile = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["branchOwner"],
    queryFn: async () => await GetBranchWithoutIdAction(),
  });
  if (isPending) {
    return <div>loading....</div>;
  }
  if (isError) {
    return <div className="text-red-500">Error occurs</div>;
  }

  return (
    <div>
      <BranchInfo info={data.branch!} />
    </div>
  );
};

export default BranchProfile;
