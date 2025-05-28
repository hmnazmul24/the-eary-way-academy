"use server";

import { prisma } from "@/lib/db";

export const UniqueBranchCode = async (): Promise<string | null> => {
  try {
    let uniqueCode: string;

    while (true) {
      // Generate a 6-digit random number as a string
      const randomNumber = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      // Check if the generated code already exists in the database
      const info = await prisma.branch.findFirst({
        where: { branchCode: randomNumber },
      });

      if (!info) {
        // If the code is not found, it's unique
        uniqueCode = randomNumber;
        break;
      }
    }

    return uniqueCode;
  } catch (error) {
    console.error("Error generating unique branch code:", error);
    return null; // Handle errors gracefully
  }
};
