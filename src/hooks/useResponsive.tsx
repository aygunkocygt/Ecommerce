import { useEffect, useState } from "react";

// Define the type for breakpoints array
type Breakpoints = number[];

// Define the hook
export const useResponsive = (breakpoints: Breakpoints): number => {
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    const updateIndex = () => {
      const width = window.innerWidth;
      // Find the index of the first breakpoint that is greater than or equal to the width
      const newIndex = breakpoints.findIndex((bp) => width <= bp);
      setIndex(newIndex === -1 ? breakpoints.length : newIndex);
    };

    updateIndex();
    window.addEventListener("resize", updateIndex);
    return () => window.removeEventListener("resize", updateIndex);
  }, [breakpoints]);

  return index;
};
