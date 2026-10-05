import { IconLoader } from "@tabler/icons-react";
import { cn } from "cn";
import type { ComponentProps } from "react";

const Spinner = ({ className, ...props }: ComponentProps<"svg">) => (
	<IconLoader
		data-slot="spinner"
		// svg icon announcing loading status; output element cannot render the icon.
		// oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
		role="status"
		aria-label="Loading"
		className={cn("size-4 animate-spin", className)}
		{...props}
	/>
);

export { Spinner };
