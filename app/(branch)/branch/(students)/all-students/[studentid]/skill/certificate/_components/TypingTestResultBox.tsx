import React, { useEffect, useState } from "react";
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
import { createOrUpdateNewTypingRecord } from "@/actions/studentsForAdmin/SkillCertificates";
import { customToast } from "@/components/shared/ToastContainer";
import { createTypingCertificate } from "./certificate/generateCertificateFunc";

type TypingStudentType = {
  name: string;
  userId?: number;
  roll: string;
  speed?: number;
  studentId: string;
  id?: string;
};
const TypingTestResultBox = ({
  name,
  roll,
  speed,
  userId,
  id,
  studentId,
}: TypingStudentType) => {
  const queryClient = useQueryClient();
  const [wpm, setWpm] = useState<string>("");
  const { mutate, isPending } = useMutation({
    mutationFn: createOrUpdateNewTypingRecord,
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
  const { isPending: typing_pending, mutate: typing_mutate } = useMutation({
    mutationFn: createTypingCertificate,
  });

  const handleSubmit = () => {
    if (!wpm)
      return customToast("error", "Please, provide typing speed (wpm) !");
    if (Number(wpm) === speed) return;

    let data = { id, name, studentId, wpm: Number(wpm) };

    mutate(data);
  };

  useEffect(() => {
    if (speed) {
      setWpm(speed.toString());
    } else {
      setWpm("");
    }
  }, [speed]);
  return (
    <Card>
      <CardHeader>
        <CardTitle></CardTitle>
      </CardHeader>
      <CardContent>
        <Label htmlFor="typing">Student Name</Label>
        <Input type="text" name="typing" disabled value={name} />
        {userId && (
          <>
            <Label htmlFor="typing">User Id</Label>
            <Input type="text" name="typing" disabled value={userId} />
          </>
        )}
        <Label htmlFor="roll">Student Roll</Label>
        <Input type="text" name="roll" disabled value={roll} />
        <Label htmlFor="speed">Student Speed * (wpm)</Label>
        <Input
          type="number"
          name="speed"
          placeholder="Give the WPM number"
          value={wpm}
          onChange={(e) => setWpm(e.target.value)}
        />
      </CardContent>
      <CardFooter className="flex items-center justify-end gap-1">
        {userId ? (
          <div className="space-x-2">
            <Button onClick={handleSubmit}>Update</Button>
            <Button
              onClick={() =>
                typing_mutate({ name, speed: wpm, userId: userId.toString() })
              }
              disabled={typing_pending}
              className="bg-purple-500 text-white"
            >
              Download
            </Button>
          </div>
        ) : (
          <Button onClick={handleSubmit} disabled={isPending}>
            Generate
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TypingTestResultBox;
