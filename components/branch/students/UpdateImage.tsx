"use client";

import React, { ReactNode, useRef } from "react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useStudentStore from "@/hooks/useStudentStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfileImage } from "@/actions/student";
import { customToast } from "@/components/shared/ToastContainer";
import { getBase64String } from "@/components/data/helpers";
import { useParams } from "next/navigation";

const AvatarEdit = dynamic(() => import("./AvaterEdit"), { ssr: false });

const UpdateImage = ({ children }: { children: ReactNode }) => {
  const { updateProfileUrl, setUpdateProfileUrl, setPorfileUrl } =
    useStudentStore();
  const queryClient = useQueryClient();
  let { id: studentId } = useParams<{ id: string }>();

  // refs
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // update
  const { mutate, isPending } = useMutation({
    mutationFn: updateProfileImage,
    onSuccess: ({ error, message }) => {
      if (error) {
        return customToast("error", error);
      }
      if (message) {
        triggerRef.current?.click();
        setUpdateProfileUrl(null);
        customToast("success", message);
      }
      queryClient.invalidateQueries({
        queryKey: ["singleStudent"],
      });
    },
  });

  const handleUpdate = async () => {
    if (updateProfileUrl) {
      let formData = new FormData();
      let imgString = await getBase64String(updateProfileUrl as File);
      formData.append("img_string", imgString);
      formData.append("student_id", studentId);
      mutate({ formData });
    }
  };

  return (
    <div>
      <Drawer onClose={() => setUpdateProfileUrl(null)}>
        <DrawerTrigger
          ref={triggerRef}
          className="text-sm p-2 rounded-md mb-1 hover:text-yellow-600 text-yellow-500"
        >
          {children}
        </DrawerTrigger>
        <DrawerContent
          className={cn(
            "min-h-[50vh]  transition-all mb-8 flex items-center justify-center"
          )}
        >
          <AvatarEdit label="update image" isUpdate={true} />
          <div className="w-full m-5 flex items-center justify-end ">
            <Button
              disabled={isPending}
              className=" mr-5 md:mr-10"
              onClick={handleUpdate}
            >
              {isPending ? "Updating.." : "Update Image"}
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default UpdateImage;
