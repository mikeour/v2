import { useScroll, useTransform } from "framer-motion";

type OptionsType = {
  ref: React.RefObject<HTMLElement>;
};

function _useScrollShadows({ ref }: OptionsType) {
  const { scrollXProgress } = useScroll({ container: ref });

  const startingShadowVisibility = useTransform(scrollXProgress, (latest) => {
    const element = ref.current;
    if (element === null) {
      return latest;
    }

    const isOverflowing = element.scrollWidth > element.clientWidth;

    if (isOverflowing) {
      return latest; // preserve existing behavior
    }
    return 0; // override the default value
  });

  const endingShadowVisibility = useTransform(
    scrollXProgress,
    (latest) => 1 - latest
  );

  return [startingShadowVisibility, endingShadowVisibility] as const;
}
