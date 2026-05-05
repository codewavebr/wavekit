"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as React from "react";

import { cn } from "../utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {
  const [animatedValue, setAnimatedValue] = React.useState(0);

  React.useEffect(() => {
    setAnimatedValue(0);
    const timer = setTimeout(() => {
      setAnimatedValue(value || 0);
    }, 10);

    return () => clearTimeout(timer);
  }, [value]);

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-mainColor/20",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 rounded-full bg-mainColor transition-all duration-1000 ease-out"
        style={{
          transform: `translateX(-${100 - animatedValue}%)`,
        }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
