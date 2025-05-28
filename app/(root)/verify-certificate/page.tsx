"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, XCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { skillCertificateVarification } from "@/actions/studentsForAdmin/SkillCertificates";
import { customToast } from "@/components/shared/ToastContainer";

export default function CertificateVerificationPage() {
  const [userId, setUserId] = useState("");
  const [certificateType, setCertificateType] = useState<"typing" | "design">(
    "typing"
  );
  // const [certificate, setCertificate] = useState<Certificate | null>(null);
  // const [notFound, setNotFound] = useState(false);

  const { mutate, isPending, data } = useMutation({
    mutationFn: skillCertificateVarification,
  });

  const handleSearch = async () => {
    mutate({ type: certificateType, userId: Number(userId) });

    ///
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">
            Certificate Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Enter User ID"
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <Select
            value={certificateType}
            onValueChange={(value) =>
              setCertificateType(value as "typing" | "design")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Certificate Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="typing">Typing</SelectItem>
              <SelectItem value="design">Design</SelectItem>
            </SelectContent>
          </Select>
          <Button
            disabled={isPending}
            className="w-full"
            onClick={handleSearch}
          >
            Search
          </Button>

          {data && data?.data && (
            <div className="flex flex-col items-center justify-center p-4 border rounded-xl bg-green-100">
              <CheckCircle className="text-green-600 w-10 h-10" />
              <p className="mt-2 text-lg font-semibold text-green-700">
                Certificate Verified
              </p>
              <div className="text-sm text-gray-700 mt-2 space-y-1">
                <p>
                  <strong>Name:</strong> {data.data.name}
                </p>
                <p>
                  <strong>User Id:</strong> {data.data.userId}
                </p>

                <p>
                  <strong>Certificate Type:</strong> {data.type}
                </p>
                {data.type === "typing" ? (
                  <p>
                    <strong>Achieved:</strong> {data.data.speed} wpm
                  </p>
                ) : (
                  <p>
                    <strong>Session:</strong> {data.data.session}
                  </p>
                )}
              </div>
            </div>
          )}

          {data?.notFount && (
            <div className="flex flex-col items-center justify-center p-4 border rounded-xl bg-red-100">
              <XCircle className="text-red-600 w-10 h-10" />
              <p className="mt-2 text-lg font-semibold text-red-700">
                Certificate Not Found
              </p>
              <p className="text-sm text-gray-700 mt-1">
                No records found for the given User ID and Certificate Type.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
