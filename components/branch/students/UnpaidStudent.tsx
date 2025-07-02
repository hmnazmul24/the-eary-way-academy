"use client";

// import { processAmerpayPayment } from "@/actions/amerpay";
import { AdminStudentPayment } from "@/actions/payments";
import { consizeData } from "@/components/data/priceHelper";
import { customToast } from "@/components/shared/ToastContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CourseFeesType, Student } from "@/types";
import { BranchStudentType } from "@/types/students";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { BsThreeDotsVertical } from "react-icons/bs";
import StudentActionLists from "./studentEditOptions/StudentActionLists";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { applyForAcceptWithPaymentTnxId } from "@/actions/new-features/student";

// type PaymentType = {
//   id: string;
//   amount: string;
//   phone: string;
//   name: string;
// };

const UnPaidStudentTable = ({
  info,
  feesData,
  isAdminStudent,
}: {
  info: BranchStudentType[] | null;
  feesData: CourseFeesType[];
  isAdminStudent: boolean;
}) => {
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  //for payment
  const [studentId, setStudentId] = useState<string>("");
  const [trnxId, setTrnxId] = useState<string>("");

  const queryClient = useQueryClient();
  // todo:
  // const hanleClickFunc = async (info: PaymentType) => {
  //   setLoading(info.id);
  //   try {
  //     let data = await processAmerpayPayment(info);
  //     if (data.data?.payment_url) {
  //       window.open(data.data.payment_url, "_self");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoading(null);
  //   }
  // };

  // trnx---------------------------------------------------------s
  const tranxMutation = useMutation({
    mutationFn: applyForAcceptWithPaymentTnxId,
    onSuccess: ({ message }) => {
      customToast("success", message);
      queryClient.invalidateQueries({ queryKey: ["allStudentsOfBranch"] });
      setStudentId("");
      setTrnxId("");
    },
  });
  const handleTrnxId = () => {
    if (!trnxId || !studentId) return null;

    tranxMutation.mutate({ info: { trnxId, studentId } });
  };
  // trnx---------------------------------------------------------e
  const hanleAdminStudentPayment = async (id: string) => {
    setLoading(id);
    try {
      let data = await AdminStudentPayment(id);
      if (data?.success) {
        customToast("success", "Student Accepted");
        queryClient.invalidateQueries({ queryKey: ["allStudentsOfBranch"] });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  const columns: TableColumn<Student>[] = [
    {
      name: "Picture",
      cell: (row) => (
        <Image
          height={100}
          width={100}
          src={row.picture!}
          alt={row.name}
          className="w-10 my-2 h-10 rounded-sm"
        />
      ),
      sortable: false,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Mobile",
      selector: (row) => row.mobile,
      sortable: true,
    },
    {
      name: "Trade",
      selector: (row) => row.trade,
      sortable: true,
    },
    {
      name: "Session",
      selector: (row) => row.session,
      sortable: true,
    },
    {
      name: "Fees",
      cell: (row) =>
        row.isAdminStudent ? (
          <Button
            className="bg-amber-500 hover:bg-amber-700"
            onClick={() => hanleAdminStudentPayment(row.id)}
            disabled={loading === row.id} // Disable button if request is in progress
          >
            {loading === row.id ? "Processing..." : "Accept"}
          </Button>
        ) : (
          <div>
            {typeof row.fees === "boolean" || row.fees === "" ? (
              <div className="p-2 rounded text-white bg-amber-500">
                Contact with admin
              </div>
            ) : (
              <div className="">
                {row.trnxId ? (
                  <Button
                    disabled
                    className="border border-blue-500"
                    variant={"secondary"}
                  >
                    Varifying
                  </Button>
                ) : (
                  <Button
                    className="bg-amber-500 font-sans text-sm hover:bg-amber-600"
                    onClick={() =>
                      // await hanleClickFunc({
                      //   id: row.id,
                      //   amount: row.fees as string,
                      //   name: row.name,
                      //   phone: row.mobile,
                      // })
                      setStudentId(row.id)
                    }
                    disabled={loading === row.id} // Disable button if request is in progress
                  >
                    {loading === row.id
                      ? "Processing..."
                      : `Pay ${row.fees} BDT`}
                  </Button>
                )}
              </div>
            )}
          </div>
        ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <StudentActionLists
          studentId={row.id}
          imgUrl={row.picture!}
          publicId={row.publicId}
          students={info}
        >
          <div className=" p-2 ">
            <BsThreeDotsVertical className="text-xl" />
          </div>
        </StudentActionLists>
      ),
    },
  ];

  let data =
    info === null
      ? []
      : consizeData({ data: info, feesInfo: feesData, isAdminStudent });

  const filteredItems = data.filter(
    (item) =>
      item.name && item.name.toLowerCase().includes(filterText.toLowerCase())
  );

  //single student info for showing student details

  console.log(filteredItems);

  return (
    <div className="tableContainer">
      <div className="p-4 min-w-[600px] bg-white rounded-sm">
        <DataTable
          title={
            <div className="w-full  flex items-center justify-between">
              <div>
                <span>Students Lists</span>
              </div>{" "}
              <div className="flex items-center my-2 justify-end gap-2">
                <Input
                  type="text"
                  placeholder="Search by name"
                  className="p-2 border w-52 border-gray-300 rounded"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
                <Button
                  className="ml-2  text-white p-2 px-4 rounded"
                  onClick={() => {
                    setResetPaginationToggle(!resetPaginationToggle);
                    setFilterText("");
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
          }
          theme="tomato"
          columns={columns}
          data={filteredItems}
          pagination
          highlightOnHover
          paginationResetDefaultPage={resetPaginationToggle}
          responsive
        />
      </div>
      <Dialog
        open={studentId ? true : false}
        onOpenChange={(v) => {
          if (!v) {
            setStudentId("");
            setTrnxId("");
          }
        }}
      >
        <DialogContent className="font-normal">
          <DialogHeader>
            <DialogTitle className="font-normal text-base">
              Payment via <span className="text-yellow-500">Bkash</span> to{" "}
              <span className="font-bold text-xl text-blue-500 mr-2">
                01880110842
              </span>
              powered by{" "}
              <span className="font-bold text-xl">The Earn Way Academy</span>;
            </DialogTitle>
            <div className="space-y-3">
              <div className="text-green-500">If you have already done.</div>
              <div className="space-y-2">
                <Input
                  placeholder="Enter trnx id form bkash payment"
                  value={trnxId}
                  onChange={(e) => setTrnxId(e.target.value)}
                />
                <Button
                  disabled={tranxMutation.isPending}
                  onClick={handleTrnxId}
                >
                  Submit
                </Button>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UnPaidStudentTable;
