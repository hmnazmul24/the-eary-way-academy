"use client";

import useStudentStore from "@/hooks/useStudentStore";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useRef } from "react";
import Avatar from "react-avatar-edit";

const AvatarEdit = ({
  label,
  isUpdate = false,
}: {
  label?: string;
  isUpdate?: boolean;
}) => {
  const { profileUrl, setPorfileUrl, updateProfileUrl, setUpdateProfileUrl } =
    useStudentStore();
  const avatarRef = useRef<HTMLDivElement>(null);

  const onClose = () => {
    setPorfileUrl(null);
    setUpdateProfileUrl(null);
  };

  const onCrop = (preview: any) => {
    fetch(preview)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "cropped-image.png", {
          type: "image/png",
        });
        if (isUpdate) {
          setUpdateProfileUrl(file);
        } else {
          setPorfileUrl(file);
        }
      });
  };

  const onBeforeFileLoad = (elem: React.ChangeEvent<HTMLInputElement>) => {
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB in bytes

    if (elem.target.files && elem.target.files[0].size > MAX_FILE_SIZE) {
      alert("File is too big! Please upload a file smaller than 10 MB.");
      elem.target.value = ""; // Reset the input value
    }
  };
  const handleDivClick = () => {
    if (avatarRef.current) {
      // Trigger the file input within react-avatar-edit
      const fileInput = avatarRef.current.querySelector("input[type='file']");
      if (fileInput) {
        (fileInput as HTMLInputElement).click();
      }
    }
  };

  return (
    <div>
      {/* Wrapper div to make the avatar clickable */}
      <div
        className="bg-white inline-block rounded-md overflow-hidden cursor-pointer"
        ref={avatarRef}
        onClick={handleDivClick} // Handle click to trigger file input
      >
        <Avatar
          width={250}
          height={200}
          onCrop={onCrop}
          onClose={onClose}
          onBeforeFileLoad={onBeforeFileLoad}
          cropColor="tomato"
          cropRadius={0}
          backgroundColor="gray"
          exportAsSquare
          label={label ? label : "Add a Student Image"}
          labelStyle={{ fontSize: "0.9rem", fontWeight: "bold" }}
        />
      </div>

      {/* Preview cropped image */}
      {profileUrl && (
        <div className="mt-4">
          <h1 className="font-bold text-sm my-3">Cropped Image</h1>
          <Image
            src={URL.createObjectURL(profileUrl)}
            className="border rounded-md border-gray-800"
            height={150}
            width={150}
            alt="Preview"
          />
        </div>
      )}
      {isUpdate && updateProfileUrl && (
        <div className="mt-4">
          <h1 className="font-bold text-sm my-3">Cropped Image</h1>
          <Image
            src={URL.createObjectURL(updateProfileUrl)}
            className="border rounded-md border-gray-800"
            height={150}
            width={150}
            alt="Preview"
          />
        </div>
      )}
    </div>
  );
};

export default AvatarEdit;
