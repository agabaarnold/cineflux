import { cn } from "cn";
import type { ComponentProps } from "react";

const Skeleton = ({ className, ...props }: ComponentProps<"div">) => (
	<div
		data-slot="skeleton"
		className={cn("bg-muted animate-pulse rounded-md", className)}
		{...props}
	/>
);

export { Skeleton };
