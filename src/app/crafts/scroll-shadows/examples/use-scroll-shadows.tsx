import { useScroll, useTransform } from "framer-motion";

// some inspo here: https://www.qovery.com/blog/adding-elegant-shadows-with-react-to-invite-users-to-scroll/
export function useScrollShadows<T extends HTMLElement>(
  ref: React.RefObject<T>
) {
  const { scrollYProgress } = useScroll({
    container: ref,
  });

  const modifiedScrollYProgress = useTransform(scrollYProgress, (latest) => {
    const element = ref.current;

    // if the element is overflowing, pass along the value as expected
    if (element) {
      const isOverflowing = element.scrollHeight > element.clientHeight;
      if (isOverflowing) return latest;
    }

    // if the element is not overflowing
    // override framer-motion defaults and pass 0 instead of 1
    return 0;
  });

  const top = useTransform(modifiedScrollYProgress, [0, 1], [0, 1]);
  const bottom = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return [top, bottom] as const;
}
