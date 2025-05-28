import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNewDesignCertificateRecord } from "@/actions/studentsForAdmin/SkillCertificates";
import { customToast } from "@/components/shared/ToastContainer";
import { createDesignCertificate } from "./certificate/generateCertificateFunc";

type TypingStudentType = {
  name: string;
  userId?: number;
  roll: string;
  session: string;
  studentId: string;
};
const DesignResultBox = ({
  name,
  roll,
  session,
  studentId,
  userId,
}: TypingStudentType) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: createNewDesignCertificateRecord,
    onSuccess: async ({ error, message }) => {
      if (error) {
        return customToast("error", error);
      }
      if (message) {
        customToast("success", message);
      }
      await queryClient.invalidateQueries({
        queryKey: ["StudentSkillCertificateInfo"],
      });
    },
  });

  // downloading certificate
  const { isPending: design_pending, mutate: design_mutate } = useMutation({
    mutationFn: createDesignCertificate,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle></CardTitle>
      </CardHeader>
      <CardContent>
        <Label htmlFor="name">Student Name</Label>
        <Input type="text" name="name" disabled value={name} />
        {userId && (
          <>
            <Label htmlFor="userId">User Id</Label>
            <Input type="text" name="userId" disabled value={userId} />
          </>
        )}
        <Label htmlFor="roll">Student Roll</Label>
        <Input type="text" name="roll" disabled value={roll} />
        <Label htmlFor="session">Student Session</Label>
        <Input type="text" name="session" disabled value={session} />
      </CardContent>
      <CardFooter className="flex items-center justify-end gap-1">
        <div>
          {!userId ? (
            <Button disabled={isPending} onClick={() => mutate({ studentId })}>
              Generate
            </Button>
          ) : (
            <Button
              disabled={design_pending}
              onClick={() =>
                design_mutate({ name, userId: userId.toString(), session })
              }
              className="bg-emerald-500"
            >
              Download
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default DesignResultBox;
