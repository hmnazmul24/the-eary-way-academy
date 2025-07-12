"use server";

import { generateUniqueTransId } from "@/data/helper";
import { prisma } from "@/lib/db";

type TrnxType = {
  studentId: string;
  trnxId: string;
  amount: string;
};

export const applyForAcceptWithPaymentTnxId = async ({
  info,
}: {
  info: TrnxType;
}) => {
  await prisma.student.update({
    where: { id: info.studentId },
    data: {
      paymentTransjunctionId: info.trnxId,
      courseFeesPaidAmount: info.amount,
    },
  });

  return { message: "Request successfull, we would varify it soon." };
};
export const requestedStudentListOfBranch = async ({ id }: { id: string }) => {
  return await prisma.student.findMany({
    where: {
      branchId: id,
      paymentTransjunctionId: { not: null },
      isPaymentTranxIdValid: { not: true },
    },
  });
};

export const adminVarifiedStudent = async ({
  studentId,
  paymentAmount,
}: {
  studentId: string;
  paymentAmount: string;
}) => {
  let transId = generateUniqueTransId();

  let student = await prisma.student.update({
    where: { id: studentId },
    data: { transId, isPaid: true, isPaymentTranxIdValid: true },
  });

  if (student) {
    await prisma.payment.create({
      data: {
        amount: paymentAmount,
        courseDuration: student?.courseDuration,
        courseTrade: student?.courseTrade,
        name: student?.name,
        roll: student.genRoll!,
        phoneNo: student.mobile,
        branchId: student.branchId,
      },
    });

    return { message: "accepted successfully" };
  }
  return { message: "something is missing" };
};
