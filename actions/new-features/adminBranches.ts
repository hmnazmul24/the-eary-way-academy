"use server";

import { prisma } from "@/lib/db";

export async function changeBrnachType({
  branchId,
  type,
}: {
  type: string;
  branchId: string;
}) {
  await prisma.branchInfo.update({
    where: { branchId },
    data: { branchType: type },
  });
}
