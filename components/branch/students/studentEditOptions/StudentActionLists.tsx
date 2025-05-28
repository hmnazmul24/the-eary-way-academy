"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import DeleteStudent from "../DeleteStudent";
import DetailStudentInfo from "./DetailStudentInfo";
import StudentPaymentRecords from "./StudentPaymentRecords";
import { BranchStudentType } from "@/types/students";
import { Download } from "lucide-react";
import { generateAdmissionFormPDF } from "@/components/data/pdf-func";
import { useQuery } from "@tanstack/react-query";
import { getBranchRole } from "@/actions/auth";
const StudentActionLists = ({
  children,
  students,
  studentId,
  imgUrl,
  publicId,
}: {
  students: BranchStudentType[] | null;
  imgUrl: string;
  publicId?: string;
  studentId: string;
  children: ReactNode;
}) => {
  // states
  const [dropdownShow, setDropdownShow] = useState<boolean | undefined>(
    undefined
  );
  //

  const { data } = useQuery({
    queryFn: async () => {
      let data = await getBranchRole();
      return data;
    },
    queryKey: ["branch-role"],
  });
  // states

  const [addpaymentShow, setAddpaymentShow] = useState<boolean>(false);
  const [studentDetailShow, setStudentDetailShow] = useState<boolean>(false);
  const [studentDeleteShow, setStudentDeleteShow] = useState<boolean>(false);

  //
  if (!students) {
    return null;
  }
  // getdata

  const studentInfo: BranchStudentType = students.filter(
    (item) => item.id === studentId
  )[0];

  return (
    <div>
      <DetailStudentInfo
        open={studentDetailShow}
        setOpen={setStudentDetailShow}
        student={studentInfo}
        imgUrl={imgUrl}
      />
      <StudentPaymentRecords
        open={addpaymentShow}
        setOpen={setAddpaymentShow}
        student={studentInfo}
        imgUrl={imgUrl}
      />

      <DropdownMenu
        open={dropdownShow}
        onOpenChange={(e) => {
          if (!e) {
            setDropdownShow(e);
          }
        }}
      >
        <DropdownMenuTrigger
          className="p-0 m-0"
          onClick={() => setDropdownShow(true)}
        >
          {children}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          side="bottom"
          className=" p-4 *:cursor-pointer"
        >
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              setDropdownShow(false);
              setStudentDetailShow(true);
            }}
          >
            Detail Info
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              setDropdownShow(false);
              setAddpaymentShow(true);
            }}
          >
            Add Payment Record
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer "
            onClick={() => {
              generateAdmissionFormPDF(studentInfo);
            }}
          >
            admission form <Download className="w-4 text-green-500 ml-2" />
          </DropdownMenuItem>
          {data && data.role?.role === "ADMIN" && (
            <Link
              className="cursor-pointer"
              href={`/branch/all-students/${studentId}/skill/certificate`}
            >
              <DropdownMenuItem className="cursor-pointer">
                Skill Certificate
              </DropdownMenuItem>
            </Link>
          )}
          <Link
            className="cursor-pointer"
            href={`/branch/unpaid-students/${studentId}?${
              studentInfo.isPaid === true
                ? "back=all-students"
                : "back=unpaid-students"
            }`}
          >
            <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
          </Link>

          {publicId && (
            <>
              <DropdownMenuItem
                className="text-red-500 cursor-pointer "
                onClick={(e) => {
                  setDropdownShow(false);
                  setStudentDeleteShow(true);
                }}
              >
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {publicId && (
        <DeleteStudent
          open={studentDeleteShow}
          setOpen={setStudentDeleteShow}
          id={studentId}
          public_id={publicId}
        />
      )}
    </div>
  );
};

export default StudentActionLists;
