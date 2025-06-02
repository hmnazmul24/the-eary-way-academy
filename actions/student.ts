"use server";

import { jwtDecode } from "@/data/auth";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "@/data/cloudinary_file_upload";
import { generateRollAndRegistrationNumbers } from "@/data/RollAndReg";
import { sendAdmissionEmail } from "@/data/student_mails";
import { prisma } from "@/lib/db";
import { StudentSchema, StudentType } from "@/Schema/studentSchema";
import { cookies } from "next/headers";

export const createStudentAction = async (formData: FormData) => {
  try {
    const studentInfo = JSON.parse(
      formData.get("studentInfo") as string
    ) as StudentType;
    const profileUrl = formData.get("profileUrl") as string;

    let result = StudentSchema.safeParse(studentInfo);
    if (result.error) {
      return { error: result.error.format() };
    }
    if (studentInfo.email) {
      const isEmailExists = await prisma.student.findUnique({
        where: { email: studentInfo.email },
      });
      if (isEmailExists) {
        return { email: "email already exists" };
      }
    }

    let token = (await cookies()).get("branch_token")?.value;
    if (!token) {
      return { error: "token does'nt exist" };
    }
    let branchId = jwtDecode(token).id;
    let {
      bloodGroup,
      courseDuration,
      courseRange,
      courseTrade,
      dateOfBirth,
      fatherName,
      gender,
      mediam,
      mobile,
      motherName,
      name,
      nationality,
      passedBoard,
      passedResult,
      passedRoll,
      passedType,
      passedYear,
      religion,
      email,
    } = studentInfo;

    let { secure_url, public_id } = await uploadToCloudinary({
      file: profileUrl,
      folder: "student",
    });

    let { nextRollNumber, nextRegistrationNumber, certificateSLNo } =
      await generateRollAndRegistrationNumbers();

    await prisma.student.create({
      data: {
        branchId,
        bloodGroup,
        courseDuration,
        courseRange,
        courseTrade,
        dateOfBirth,
        fatherName,
        gender,
        mediam,
        mobile,
        motherName,
        name,
        nationality,
        passedBoard,
        passedResult,
        passedRoll,
        passedType,
        passedYear,
        certificateSLNo,
        religion,
        email: email ? email : null,
        genReg: nextRegistrationNumber,
        genRoll: nextRollNumber,
        profileDoc: {
          create: { secure_url: secure_url!, public_id: public_id! },
        },
      },
    });

    if (email) {
      await sendAdmissionEmail(name, email);
    }

    return { message: "new student has created" };
  } catch (error) {
    return { error: "internal server error" };
  }
};
export const updateStudentAction = async ({
  formData,
  id,
}: {
  formData: FormData;
  id: string;
}) => {
  try {
    const studentInfo = JSON.parse(
      formData.get("studentInfo") as string
    ) as StudentType;

    let result = StudentSchema.safeParse(studentInfo);
    if (result.error) {
      return { error: result.error.format() };
    }
    console.log("result", result);

    let {
      bloodGroup,
      courseDuration,
      courseRange,
      courseTrade,
      dateOfBirth,
      fatherName,
      gender,
      mediam,
      mobile,
      motherName,
      name,
      nationality,
      passedBoard,
      passedResult,
      passedRoll,
      passedType,
      passedYear,
      religion,
      email,
    } = result.data;

    // update email ,
    let new_email: string | null = null;

    if (email) {
      let isEmailExists = await prisma.student.findUnique({
        where: { email: email },
      });
      // my account

      const myAccount = await prisma.student.findUnique({ where: { id } });

      if (isEmailExists && email.trim() !== myAccount?.email) {
        return { error: "email address already exists" };
      }
    }

    await prisma.student.update({
      where: { id },
      data: {
        bloodGroup,
        courseDuration,
        courseRange,
        courseTrade,
        dateOfBirth,
        fatherName,
        gender,
        mediam,
        mobile,
        motherName,
        name,
        nationality,
        passedBoard,
        passedResult,
        passedRoll,
        passedType,
        passedYear,
        religion,
        email: email ? email : null,
      },
    });
    return { message: "student updated successfully" };
  } catch (error) {
    console.log("error", error);

    return { error: "internal server error" };
  }
};

export const GetSingleStudentById = async (id: string) => {
  try {
    let student = await prisma.student.findUnique({
      where: { id },
      include: { profileDoc: true },
    });
    if (!student) {
      return { error: "student not found" };
    }
    return { student };
  } catch (error) {
    return { error: "internal server error" };
  }
};

export const DeleteSingleStudentById = async ({
  id,
  public_id,
}: {
  id: string;
  public_id: string;
}) => {
  try {
    await deleteFromCloudinary(public_id);
    await prisma.profileImg.delete({
      where: { studentId: id },
    });
    await prisma.student.delete({
      where: { id },
    });

    return { message: "student has been deleted" };
  } catch (error) {
    return { error: "internal server error" };
  }
};
export const updateProfileImage = async ({
  formData,
}: {
  formData: FormData;
}) => {
  try {
    const imgString = formData.get("img_string") as string;
    const studentId = formData.get("student_id") as string;
    if (imgString === "" || imgString === undefined || imgString === null) {
      return { error: "Please Select a Image" };
    }

    // for getting info
    const studentImgInfo = await prisma.profileImg.findUnique({
      where: { studentId },
    });
    if (!studentImgInfo) {
      return { error: "not found !" };
    }
    await deleteFromCloudinary(studentImgInfo.public_id);
    await prisma.profileImg.delete({ where: { studentId } });

    const { public_id, secure_url } = await uploadToCloudinary({
      file: imgString,
      folder: "student",
    });
    if (!public_id && !secure_url) {
      return { error: "error occurs while uloading the image !" };
    }
    await prisma.profileImg.create({
      data: {
        public_id,
        secure_url,
        studentId,
      },
    });

    return { message: "profile Image updated" };
  } catch (error) {
    return { error: "internal server error" };
  }
};
