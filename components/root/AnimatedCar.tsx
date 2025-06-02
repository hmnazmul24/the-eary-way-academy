import React from "react";
const LottieComp = dynamic(() => import("../shared/LottieComp"), {
  ssr: false,
});
import AnimatedCarLootie from "@/public/lottie/car.json";
import dynamic from "next/dynamic";

const AnimatedCar = () => {
  return (
    <div className="w-full translate-y-2 overflow-hidden">
      <LottieComp
        lottie={AnimatedCarLootie}
        height={100}
        className="w-52 lottie-car"
      />
    </div>
  );
};

export default AnimatedCar;
