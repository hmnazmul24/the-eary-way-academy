"use client";

import loadingLottie from "@/public/lottie/loading.json";
import dynamic from "next/dynamic";
import Image from "next/image";
const LottieComp = dynamic(() => import("./LottieComp"), { ssr: false });

const RootLoading = ({}: { isPending: boolean }) => {
  return (
    <div className="h-screen flex-col top-0 left-0 fixed z-50 w-full  bg-white flex items-center justify-center">
      <div className="p-4 z-40 relative -translate-x-3 drop-shadow-lg flex items-center justify-center">
        <Image
          src={"/logo.png"}
          className="drop-shadow-md md:w-20 w-16 -translate-y-2"
          height={130}
          width={130}
          alt="main_logo"
        />
      </div>
      <LottieComp
        className="-translate-y-10 -translate-x-2"
        lottie={loadingLottie}
        height={70}
      />
    </div>
  );
};

export default RootLoading;
