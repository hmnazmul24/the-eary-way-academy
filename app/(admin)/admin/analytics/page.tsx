// "use client";

// import React from "react";
// import BranchGrouthChart from "../../_charts/BranchGrouthChart";
// import StudentGrouthChart from "../../_charts/StudentGrouthChart";
// import RevenueChart from "../../_charts/RevenueChart";
// import { useQuery } from "@tanstack/react-query";
// import { admin_branch_grouth } from "@/actions/adminAnalytics";

// const AdmimPage = () => {
//   const { data, isPending } = useQuery({
//     queryKey: ["admin_growth"],
//     queryFn: async () => await admin_branch_grouth(),
//   });

//   if (isPending) {
//     return <div>Loading...</div>;
//   }
//   if (!data) {
//     return null;
//   }

//   let {
//     branchCount,
//     dataArr,
//     notVarified,
//     paidStudentsCount,
//     studentCount,
//     studentProgressArr,
//     unpaidStudentCount,
//     revenue,
//   } = data;

//   let formateStudentData = studentProgressArr
//     ?.slice()
//     .reverse()
//     .map((item, i) => ({
//       count: item.count,
//       week: `${i} week`,
//     }));
//   return (
//     <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//       <BranchGrouthChart
//         data={dataArr!}
//         branchCount={branchCount!}
//         notVarified={notVarified!}
//       />
//       <StudentGrouthChart
//         data={formateStudentData}
//         paid={paidStudentsCount!}
//         total={studentCount!}
//         unpaid={unpaidStudentCount!}
//       />
//       <RevenueChart revenue={revenue!} />
//     </div>
//   );
// };

// export default AdmimPage;

"use client";
import { admin_branch_grouth } from "@/actions/adminAnalytics";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const AdminAnalyticsPage = () => {
  const { data, isPending } = useQuery({
    queryKey: ["admin_growth"],
    queryFn: async () => await admin_branch_grouth(),
  });

  if (isPending) {
    return <div>Loading data ....</div>;
  }

  return (
    <div>
      {data && (
        <div>
          <div className="*:p-4 border bg-green-300/20 ">
            <div>
              <h1 className="font-bold">Total Student Count</h1>
              {data.studentCount}
            </div>
            <div>
              <h1>Total Paid Students</h1>
              {data.paidStudentsCount}
            </div>
            <div>
              <h1>Total Unpaid Students</h1>
              {data.unpaidStudentCount}
            </div>
            <div>
              <h1>Revenue</h1>
              {data.revenue}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalyticsPage;
