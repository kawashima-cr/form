import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";
function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer relative w-13 h-7 data-[state=checked]:bg-indigo-600 data-[state=unchecked]:bg-indigo-200 focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex shrink-0 items-center rounded border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 before:pointer-events-none before:absolute before:left-1 before:text-[14px] before:font-bold before:leading-none before:text-white before:content-['10%'] data-[state=unchecked]:before:opacity-0 data-[state=checked]:before:opacity-100 after:pointer-events-none after:absolute after:right-1 after:text-[14px] after:font-bold after:leading-none after:text-slate-800 after:content-['8%'] data-[state=checked]:after:opacity-0",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block w-4 h-5 rounded bg-white shadow-sm shadow-black/10 ring-0 transition-transform duration-200 ease-out data-[state=checked]:translate-x-[calc(200%)] data-[state=unchecked]:translate-x-0.5"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
