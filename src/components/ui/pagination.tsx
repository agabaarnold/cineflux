import {
	IconChevronLeft,
	IconChevronRight,
	IconDots,
} from "@tabler/icons-react";
import { cn } from "cn";
import type { ComponentProps } from "react";

import { buttonVariants } from "#/components/ui/button.tsx";
import type { Button } from "#/components/ui/button.tsx";

const Pagination = ({ className, ...props }: ComponentProps<"nav">) => (
	<nav
		role="navigation"
		aria-label="Pagination"
		data-slot="pagination"
		className={cn("mx-auto flex w-full justify-center", className)}
		{...props}
	/>
);

const PaginationContent = ({ className, ...props }: ComponentProps<"ul">) => (
	<ul
		data-slot="pagination-content"
		className={cn("flex items-center gap-0.5", className)}
		{...props}
	/>
);

const PaginationItem = ({ ...props }: ComponentProps<"li">) => (
	<li data-slot="pagination-item" {...props} />
);

type PaginationLinkProps = {
	isActive?: boolean;
} & Pick<ComponentProps<typeof Button>, "size"> &
	ComponentProps<"a">;

const PaginationLink = ({
	children,
	className,
	isActive,
	size = "icon",
	...props
}: PaginationLinkProps) => (
	<a
		aria-current={isActive ? "page" : undefined}
		data-slot="pagination-link"
		data-active={isActive}
		className={cn(
			buttonVariants({
				variant: isActive ? "outline" : "ghost",
				size,
				className,
			})
		)}
		{...props}
	>
		{children}
	</a>
);

const PaginationPrevious = ({
	className,
	text = "Previous",
	...props
}: ComponentProps<typeof PaginationLink> & { text?: string }) => (
	<PaginationLink
		aria-label="Go to previous page"
		size="default"
		className={cn("pl-1.5!", className)}
		{...props}
	>
		<IconChevronLeft data-icon="inline-start" />
		<span className="hidden sm:block">{text}</span>
	</PaginationLink>
);

const PaginationNext = ({
	className,
	text = "Next",
	...props
}: ComponentProps<typeof PaginationLink> & { text?: string }) => (
	<PaginationLink
		aria-label="Go to next page"
		size="default"
		className={cn("pr-1.5!", className)}
		{...props}
	>
		<span className="hidden sm:block">{text}</span>
		<IconChevronRight data-icon="inline-end" />
	</PaginationLink>
);

const PaginationEllipsis = ({
	className,
	...props
}: ComponentProps<"span">) => (
	<span
		aria-hidden
		data-slot="pagination-ellipsis"
		className={cn(
			"flex size-8 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
			className
		)}
		{...props}
	>
		<IconDots />
		<span className="sr-only">More pages</span>
	</span>
);

export {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
};
