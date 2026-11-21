import { cn } from "cn";
import { Loader2Icon } from "lucide-react";

// HugeiconsIcon only accepts a number for strokeWidth, so we leave the svg one out.
function Spinner({
  className,
  ...props
}: Omit<React.ComponentProps<"svg">, "strokewidth">) {
  return (
    <Loader2Icon
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
