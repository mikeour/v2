import { useScroll, useTransform } from "framer-motion";

type OptionsType = {
  ref: React.RefObject<HTMLElement>;
};

function useScrollShadows({ ref }: OptionsType) {
  const { scrollYProgress } = useScroll({ container: ref });

  const startingShadowVisibility = scrollYProgress;

  const endingShadowVisibility = useTransform(
    scrollYProgress,
    (latest) => 1 - latest
  );

  return [startingShadowVisibility, endingShadowVisibility] as const;
}
