import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

const isTouchDevice = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: coarse)").matches;

interface TooltipContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isTouch: boolean;
}

const TooltipContext = React.createContext<TooltipContextValue | null>(null);

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = ({
  children,
  open: openProp,
  onOpenChange,
  ...rest
}: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>) => {
  const isTouch = isTouchDevice();
  const [open, setOpen] = React.useState(false);

  // Sur mobile : ferme le tooltip au tap en dehors (phase bubble pour éviter
  // la collision avec le handler du trigger qui toggle en premier)
  React.useEffect(() => {
    if (!open || !isTouch) return;
    const close = () => setOpen(false);
    const id = setTimeout(() => {
      document.addEventListener("click", close);
    }, 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener("click", close);
    };
  }, [open, isTouch]);

  return (
    <TooltipContext.Provider value={{ open, setOpen, isTouch }}>
      <TooltipPrimitive.Root
        open={isTouch ? open : openProp}
        onOpenChange={isTouch ? setOpen : onOpenChange}
        {...rest}
      >
        {children}
      </TooltipPrimitive.Root>
    </TooltipContext.Provider>
  );
};

const TooltipTrigger = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>
>(({ onClick, ...props }, ref) => {
  const ctx = React.useContext(TooltipContext);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ctx?.isTouch) {
      ctx.setOpen((prev) => !prev);
    }
    onClick?.(e);
  };

  return (
    <TooltipPrimitive.Trigger ref={ref} onClick={handleClick} {...props} />
  );
});
TooltipTrigger.displayName = TooltipPrimitive.Trigger.displayName;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md bg-foreground px-2.5 py-1 text-xs text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-tooltip-content-transform-origin]",
      className,
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
