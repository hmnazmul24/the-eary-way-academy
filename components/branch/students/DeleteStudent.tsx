"use client";

import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteSingleStudentById } from "@/actions/student";
import { customToast } from "@/components/shared/ToastContainer";
import useModalShowHooks from "@/hooks/useModalShowHooks";

const DeleteStudent = ({
  id,
  public_id,
  open,
  setOpen,
}: {
  id: string;
  public_id: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess, data } = useMutation({
    mutationFn: DeleteSingleStudentById,
    onSuccess: ({ error, message }) => {
      if (error) {
        return customToast("error", error);
      }
      if (message) customToast("success", message);
      queryClient.invalidateQueries({ queryKey: ["allStudentsOfBranch"] });
    },
  });
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="hidden"></DialogTrigger>
        <DialogContent className="rounded-sm">
          <DialogHeader>
            <DialogTitle className=" text-center">
              Are you sure to delete this student?
            </DialogTitle>
            <DialogDescription className="flex items-center justify-center">
              <Button
                disabled={isPending}
                className="bg-red-500  my-6 hover:bg-red-600"
                onClick={() => mutate({ id, public_id })}
              >
                {data?.message ? "Deleted" : "Delete"}
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteStudent;
