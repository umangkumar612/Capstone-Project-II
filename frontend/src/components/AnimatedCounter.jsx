import React from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

export default function AnimatedCounter({ value, suffix = "" }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => `${Number(latest).toLocaleString(undefined, { maximumFractionDigits: value % 1 ? 1 : 0 })}${suffix}`);

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.4, ease: "easeOut" });
    return controls.stop;
  }, [count, value]);

  return <motion.span>{rounded}</motion.span>;
}
