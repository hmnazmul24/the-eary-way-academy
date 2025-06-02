"use client";

const Contact = dynamic(() => import("@/components/root/Contact"), {
  ssr: false,
});
const Hero = dynamic(() => import("@/components/root/Hero"), { ssr: false });
const HowItsWork = dynamic(() => import("@/components/root/HowItsWork"), {
  ssr: false,
});
const PopularCourse = dynamic(() => import("@/components/root/PopularCourse"), {
  ssr: false,
});
const AnimatedCar = dynamic(() => import("@/components/root/AnimatedCar"), {
  ssr: false,
});
const Quality = dynamic(() => import("@/components/root/Quality"), {
  ssr: false,
});
import { motion, useScroll } from "framer-motion";
import dynamic from "next/dynamic";

import { Fragment } from "react";

const HomePage = () => {
  const { scrollYProgress } = useScroll();

  return (
    <Fragment>
      <div>
        <motion.div
          className="fixed z-50 right-0 top-0 left-0 origin-left h-1 md:h-2 bg-amber-500"
          style={{ scaleX: scrollYProgress }}
        />

        <div className="w-full md:container">
          <Hero />
          <Quality />
          <HowItsWork />
          <PopularCourse />
          <Contact />
          <AnimatedCar />
        </div>
      </div>
    </Fragment>
  );
};

export default HomePage;
