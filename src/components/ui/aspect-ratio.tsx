import { cn } from "cn";
import type { CSSProperties, ComponentProps } from "react";

const AspectRatio = ({
	ratio,
	className,
	...props
}: ComponentProps<"div"> & { ratio: number }) => (
	<div
		data-slot="aspect-ratio"
		style={
			// SAFETY: custom CSS properties are valid inline style keys at
			// runtime; the assertion only widens the type for React.
			{
				"--ratio": ratio,
			} as CSSProperties
		}
		className={cn("relative aspect-(--ratio)", className)}
		{...props}
	/>
);

export { AspectRatio };
