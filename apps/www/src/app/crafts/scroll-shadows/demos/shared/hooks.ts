import type { RefObject } from "react";
import { useScroll, useTransform } from "framer-motion";

type AxisType = "x" | "y";

export function useScrollShadows({
  ref,
  axis = "y",
}: {
  ref: RefObject<HTMLElement | null>;
  axis?: AxisType;
}) {
  const { scrollXProgress, scrollYProgress } = useScroll({ container: ref });
  const scrollProgress = axis === "x" ? scrollXProgress : scrollYProgress;

  const isOverflowing = (element: HTMLElement) =>
    axis === "x"
      ? element.scrollWidth > element.clientWidth
      : element.scrollHeight > element.clientHeight;

  const startingShadowVisibility = useTransform(scrollProgress, (latest) => {
    const element = ref.current;
    if (element === null) {
      return latest;
    }
    return isOverflowing(element) ? latest : 0;
  });

  const endingShadowVisibility = useTransform(
    scrollProgress,
    (latest) => 1 - latest
  );

  return [startingShadowVisibility, endingShadowVisibility] as const;
}

export function useBrokenScrollShadows<T extends HTMLElement>({
  ref,
}: {
  ref: RefObject<T | null>;
}) {
  const { scrollYProgress } = useScroll({ container: ref });
  const endingShadowVisibility = useTransform(
    scrollYProgress,
    (latest) => 1 - latest
  );
  return [scrollYProgress, endingShadowVisibility, scrollYProgress] as const;
}

export function useFixedScrollShadows<T extends HTMLElement>({
  ref,
}: {
  ref: RefObject<T | null>;
}) {
  const { scrollYProgress } = useScroll({ container: ref });

  const startingShadowVisibility = useTransform(scrollYProgress, (latest) => {
    const element = ref.current;
    if (element === null) {
      return latest;
    }
    const isOverflowing = element.scrollHeight > element.clientHeight;
    return isOverflowing ? latest : 0;
  });

  const endingShadowVisibility = useTransform(scrollYProgress, (latest) => {
    const element = ref.current;
    if (element === null) {
      return latest;
    }
    const isOverflowing = element.scrollHeight > element.clientHeight;
    return isOverflowing ? 1 - latest : 0;
  });

  return [
    startingShadowVisibility,
    endingShadowVisibility,
    scrollYProgress,
  ] as const;
}

export function formatDecimal(num: number) {
  return num.toFixed(1);
}
