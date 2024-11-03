"use client";

/* eslint-disable jsx-a11y/alt-text */
import { domAnimation, LazyMotion, m, useAnimation } from "framer-motion";
import type { ImageProps } from "next/image";
import Image from "next/image";
import { useEffect, useState } from "react";

const animationVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const FadeInImage = (properties: ImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const animationControls = useAnimation();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (isLoaded) {
      animationControls.start("visible");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        animate={animationControls}
        initial="hidden"
        transition={{ duration: 0.5, ease: "easeOut" }}
        variants={animationVariants}
      >
        <Image {...properties} onLoad={() => setIsLoaded(true)} />
      </m.div>
    </LazyMotion>
  );
};

export default FadeInImage;
