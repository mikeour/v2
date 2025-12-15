import { useScroll, useTransform } from "framer-motion";

type AxisType = "x" | "y";
type OptionsType = {
  ref: React.RefObject<HTMLElement | null>;
  axis: AxisType;
};

export function useScrollShadows({ ref, axis }: OptionsType) {
  const { scrollProgress, isOverflowing } = useScrollProgress({
    ref,
    axis,
  });

  const startingShadowVisibility = useTransform(scrollProgress, (latest) => {
    const element = ref.current;
    if (element === null) {
      return latest;
    }

    if (isOverflowing(element)) {
      return latest; // preserve existing behavior
    }
    return 0; // override default behavior
  });

  const endingShadowVisibility = useTransform(
    scrollProgress,
    (latest) => 1 - latest
  );

  return [startingShadowVisibility, endingShadowVisibility] as const;
}

function useScrollProgress({ ref, axis }: OptionsType) {
  const { scrollXProgress, scrollYProgress } = useScroll({
    container: ref,
  });

  if (axis === "x") {
    return {
      scrollProgress: scrollXProgress,
      isOverflowing: (element: HTMLElement) =>
        element.scrollWidth > element.clientWidth,
    };
  }
  return {
    scrollProgress: scrollYProgress,
    isOverflowing: (element: HTMLElement) =>
      element.scrollHeight > element.clientHeight,
  };
}

type UseBrokenScrollShadowsType<T> = {
  ref: React.RefObject<T | null>;
};

export function useBrokenScrollShadows<T extends HTMLElement>(
  options: UseBrokenScrollShadowsType<T>
) {
  const { ref } = options;
  const { scrollYProgress } = useScroll({ container: ref });

  const startingShadowVisibility = scrollYProgress;
  const endingShadowVisibility = useTransform(
    scrollYProgress,
    (latest) => 1 - latest
  );

  return [
    startingShadowVisibility,
    endingShadowVisibility,
    scrollYProgress,
  ] as const;
}

export function useFixedScrollShadows<T extends HTMLElement>(
  options: UseBrokenScrollShadowsType<T>
) {
  const { ref } = options;
  const { scrollYProgress } = useScroll({ container: ref });

  const startingShadowVisibility = useTransform(scrollYProgress, (latest) => {
    const element = ref.current;
    if (element === null) {
      return latest;
    }

    const isOverflowing = element.scrollHeight > element.clientHeight;

    if (isOverflowing) {
      return latest; // preserve existing behavior
    }
    return 0; // override the default value
  });

  const endingShadowVisibility = useTransform(scrollYProgress, (latest) => {
    const element = ref.current;
    if (element === null) {
      return latest;
    }

    const isOverflowing = element.scrollHeight > element.clientHeight;

    if (isOverflowing) {
      return 1 - latest;
    }
    return 0; // override the default value
  });

  return [
    startingShadowVisibility,
    endingShadowVisibility,
    scrollYProgress,
  ] as const;
}
