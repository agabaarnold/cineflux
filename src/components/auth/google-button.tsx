import { toast } from "react-hot-toast";

import { Button } from "#/components/ui/button.tsx";
import { authClient } from "#/lib/auth-client.ts";

const handleGoogle = async () => {
	const { error } = await authClient.signIn.social({
		callbackURL: "/",
		provider: "google",
	});
	if (error) {
		toast.error(error.message ?? "Something went wrong");
	}
};

export const GoogleSignInButton = () => (
	<Button
		className="w-full"
		onClick={handleGoogle}
		type="button"
		variant="outline"
	>
		<svg
			aria-hidden="true"
			className="size-4"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09"
				fill="var(--color-google-blue)"
			/>
			<path
				d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.64 1.06-2.86 0-5.29-1.93-6.16-4.66H2.18v2.84C3.39 22.02 7.02 23 12 23"
				fill="var(--color-google-green)"
			/>
			<path
				d="M5.84 14.09c-.22-.66-.36-1.39-.36-2.19 0-.8.14-1.55.36-2.2H2.18v2.84c0 .82.24 1.58.62 2.17zm0-6.48c0-.8-.14-1.54-.36-2.2H2.18v2.84c.38.59.62 1.35.62 2.17s-.24 1.58-.62 2.17zm0-4.32c0-.81.14-1.54.36-2.2H2.18v2.84c-.38.59-.62 1.35-.62 2.17s.24 1.58.62 2.17z"
				fill="var(--color-google-yellow)"
			/>
			<path
				d="M12 5.38c1.62 0 3.06.57 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.02 1 3.39 2 2.18 4.83l3.66 2.84c.87-2.73 3.3-4.66 6.16-4.66"
				fill="var(--color-google-red)"
			/>
		</svg>
		Continue with Google
	</Button>
);
