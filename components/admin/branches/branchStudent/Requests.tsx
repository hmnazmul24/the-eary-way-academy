"use client";

import {
  adminVarifiedStudent,
  requestedStudentListOfBranch,
} from "@/actions/new-features/student";
import { customToast } from "@/components/shared/ToastContainer";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";

function Requests({ id: branchId }: { id: string }) {
  const [selected, setSelected] = useState<string>("");
  const queryClient = useQueryClient();
  const { isPending, error, data } = useQuery({
    queryKey: ["requesting_stuents"],
    queryFn: () => requestedStudentListOfBranch({ id: branchId }),
  });

  const mutation = useMutation({
    mutationFn: adminVarifiedStudent,
    onSuccess: ({ message }) => {
      customToast("success", message);
      queryClient.invalidateQueries({ queryKey: ["requesting_stuents"] });
    },
  });
  if (isPending) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error Occurs</div>;
  }
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">
        Requested Students
      </h1>

      <div className="rounded-xl shadow-lg border overflow-x-auto bg-white">
        <ul className="grid grid-cols-5 bg-blue-50 font-semibold text-gray-700 border-b px-4 py-3">
          <li>Name</li>
          <li>Trade</li>
          <li>Duration</li>
          <li>Transaction ID</li>
          <li>Action</li>
        </ul>

        {data.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            No students found.
          </div>
        )}

        {data.map((item, index) => (
          <ul
            key={item.id}
            className={`grid grid-cols-5 px-4 py-3 items-center border-b ${
              index % 2 === 0 ? "bg-white" : "bg-gray-50"
            }`}
          >
            <li className="truncate">{item.name}</li>
            <li className="text-sm truncate">{item.courseTrade}</li>
            <li>{item.courseDuration}</li>
            <li className="text-sm text-gray-600">
              {item.paymentTransjunctionId || "—"}
            </li>
            <li>
              <Button
                className="w-fit"
                size="sm"
                disabled={item.id === selected && mutation.isPending}
                onClick={() => {
                  setSelected(item.id);
                  mutation.mutate(item.id);
                }}
              >
                {item.id === selected && mutation.isPending
                  ? "Processing..."
                  : "Accept"}
              </Button>
            </li>
          </ul>
        ))}
      </div>
    </div>
  );
}

export default Requests;
