import { IconMoon, IconSun } from "@tabler/icons-react";

import { useTheme } from "#/hooks/use-theme.tsx";

export const ThemeToggle = ({ className }: { className?: string }) => {
	const { theme, toggle } = useTheme();
	const dark = theme === "dark";

	return (
		<button
			aria-label="Toggle dark mode"
			aria-pressed={dark}
			className={
				className ??
				"text-primary/75 hover:bg-accent hover:text-accent-foreground flex size-9 items-center justify-center rounded-full transition-colors"
			}
			onClick={toggle}
			type="button"
		>
			{dark ? (
				<IconSun aria-hidden="true" className="size-4" />
			) : (
				<IconMoon aria-hidden="true" className="size-4" />
			)}
		</button>
	);
};
