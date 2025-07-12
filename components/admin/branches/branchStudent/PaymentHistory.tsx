"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getBranchStudentPaymentHistory } from "@/actions/Admin";

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const PaymentHistory = ({ id }: { id: string }) => {
  const { isPending, error, data } = useQuery({
    queryKey: ["branch-student-payment-history", id],
    queryFn: async () => await getBranchStudentPaymentHistory(id),
  });

  if (isPending) return <div>Fetching data...</div>;
  if (error) return <div>Error occurred</div>;

  const totalAmount = data.reduce(
    (sum, payment) => sum + Number(payment.amount),
    0
  );

  return (
    <Card className="mt-6 shadow-md">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <CardTitle className="text-xl">Payment History</CardTitle>
          <p className="text-sm text-muted-foreground">
            Total Amount:{" "}
            <span className="text-base font-semibold text-green-700">
              ৳ {totalAmount.toLocaleString()}
            </span>
          </p>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {data.length === 0 ? (
          <p className="text-muted-foreground">No payments found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Roll</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.name}</TableCell>
                  <TableCell>{payment.roll}</TableCell>
                  <TableCell>
                    {payment.courseTrade} ({payment.courseDuration})
                  </TableCell>
                  <TableCell>{payment.phoneNo}</TableCell>
                  <TableCell>৳ {payment.amount}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        payment.status === "Paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(payment.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;
