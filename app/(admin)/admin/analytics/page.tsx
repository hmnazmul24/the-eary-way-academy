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

import React from "react";

const AdminAnalyticsPage = () => {
  return (
    <div>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus saepe
      fugit possimus incidunt, praesentium dignissimos. Mollitia expedita, magni
      velit ad ipsam corrupti minima aliquid pariatur optio ab quidem, veniam
      soluta.
    </div>
  );
};

export default AdminAnalyticsPage;
