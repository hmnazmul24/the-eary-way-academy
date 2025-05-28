"use client";

import { getCertificateInfo } from "@/actions/studentsForAdmin/giveResult";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { ReactNode, useState, useEffect } from "react";
import { createCertificate } from "@/components/data/certificate-pdf";
import { Download } from "lucide-react";

const RegistrationCardModal = ({
  children,
  id,
}: {
  children: ReactNode;
  id: string;
}) => {
  const [progress, setProgress] = useState(0); // State to track percentage progress
  const [downloading, setDownloading] = useState(false); // State to track percentage progress

  const { mutate, isPending, isSuccess, isError, data } = useMutation({
    mutationFn: getCertificateInfo,
    onMutate: () => {
      setProgress(0); // Reset progress when mutation starts
    },
    onSuccess: () => {
      setProgress(100); // Set progress to 100% on success
    },
    onError: () => {
      setProgress(0); // Reset progress on error
    },
  });

  const handleClick = () => {
    mutate(id);

    // Simulate progress updates (remove this if backend provides updates)
    let interval: NodeJS.Timeout;
    if (!isPending) {
      interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev)); // Increment progress
      }, 300);
    }
    return () => clearInterval(interval);
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger
          onClick={handleClick}
          className="text-white bg-blue-500 p-1 px-3 rounded-md"
        >
          {children}
        </DialogTrigger>
        <DialogTitle></DialogTitle>
        <DialogContent className="h-[50vh] md:max-w-[50] border-black ">
          <div className="max-h-[80vh] w-full scrollbar_hidden overflow-y-scroll flex items-center justify-center">
            {isPending ? (
              <div className=" ">
                Processing...{" "}
                <span className="text-green-500 font-bold">{progress} %</span>
              </div>
            ) : isSuccess ? (
              <div className="space-y-4 flex items-center justify-center flex-col">
                <div className="space-y-2 text-center">
                  <h1 className="text-purple-600  font-bold text-lg">
                    Ready to download.{" "}
                  </h1>
                  <p className="text-gray-400 text-sm">
                    Click the downlod button to download the pdf certificate,{" "}
                  </p>
                </div>
                <Button
                  disabled={downloading}
                  onClick={async () => {
                    setDownloading(true);
                    await createCertificate(data.info!);
                    setDownloading(false);
                  }}
                  className="bg-emerald-500 flex items-center gap-2 hover:bg-emerald-600"
                >
                  Download <Download className="p-1" />
                </Button>
              </div>
            ) : isError ? (
              <div>Error occurred. Please try again.</div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegistrationCardModal;
