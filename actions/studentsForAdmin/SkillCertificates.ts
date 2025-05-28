"use server";

import { prisma } from "@/lib/db";

export const createOrUpdateNewTypingRecord = async ({
  name,
  studentId,
  wpm,
  id,
}: {
  id?: string;
  studentId: string;
  wpm: number;
  name: string;
}) => {
  try {
    if (id) {
      await prisma.speedCertificate.update({
        where: { id: id },
        data: {
          speed: wpm,
        },
      });
      return { message: "Speed Record Updated" };
    } else {
      const unique = await GenerateUniqueCode({ CertificateFor: "typing" });
      await prisma.speedCertificate.create({
        data: {
          name,
          speed: wpm,
          userId: unique!,
          studentId,
        },
      });
      return { message: "Speed Record Created" };
    }
  } catch (error) {
    return { error: "internal server error" };
  }
};
export const createNewDesignCertificateRecord = async ({
  studentId,
}: {
  studentId: string;
}) => {
  try {
    const studentInfo = await prisma.student.findUnique({
      where: { id: studentId },
      select: { courseRange: true, name: true },
    });

    if (!studentInfo) return { error: "error occurs , try refresh" };

    const unique = await GenerateUniqueCode({ CertificateFor: "design" });
    // create new
    await prisma.officeDesignCertificate.create({
      data: {
        name: studentInfo?.name,
        session: studentInfo.courseRange,
        userId: unique!,
        studentId: studentId,
      },
    });
    return { message: "Desing certificate is ready" };
  } catch (error) {
    return { error: "internal server error" };
  }
};

export const getAdditionalCertificates = async ({
  studentId,
}: {
  studentId: string;
}) => {
  try {
    let studentRecord = await prisma.student.findUnique({
      where: { id: studentId },
      select: {
        speed_certificate: true,
        design_certificate: true,
        name: true,
        genRoll: true,
        courseRange: true,
      },
    });

    return { studentRecord };
  } catch (error) {
    return { error: "internal server error" };
  }
};
export const skillCertificateVarification = async ({
  userId,
  type,
}: {
  userId: number;
  type: "typing" | "design";
}) => {
  try {
    if (type === "typing") {
      let data = await prisma.speedCertificate.findFirst({ where: { userId } });
      if (!data) {
        return { notFount: true };
      }
      return { data, type };
    } else {
      let data = await prisma.officeDesignCertificate.findFirst({
        where: { userId },
      });
      if (!data) {
        return { notFount: true };
      }
      return { data, type };
    }
  } catch (error) {
    return { error: "internal server error" };
  }
};

/// generate unique code
const GenerateUniqueCode = async ({
  CertificateFor,
}: {
  CertificateFor: "typing" | "design";
}): Promise<number | null> => {
  try {
    if (CertificateFor === "typing") {
      let uniqueCode: number;

      while (true) {
        // Generate a 6-digit random number as a string
        const randomNumber = Math.floor(100000 + Math.random() * 900000);

        // Check if the generated code already exists in the database
        const info = await prisma.speedCertificate.findFirst({
          where: { userId: randomNumber },
        });

        if (!info) {
          // If the code is not found, it's unique
          uniqueCode = randomNumber;
          break;
        }
      }
      return uniqueCode;
    } else {
      let uniqueCode: number;

      while (true) {
        // Generate a 6-digit random number as a string
        const randomNumber = Math.floor(100000 + Math.random() * 900000);

        // Check if the generated code already exists in the database
        const info = await prisma.officeDesignCertificate.findFirst({
          where: { userId: randomNumber },
        });

        if (!info) {
          // If the code is not found, it's unique
          uniqueCode = randomNumber;
          break;
        }
      }
      return uniqueCode;
    }
  } catch (error) {
    console.error("Error generating unique branch code:", error);
    return null; // Handle errors gracefully
  }
};
