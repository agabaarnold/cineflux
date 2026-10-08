import { IconBrandGoogle } from "@tabler/icons-react";
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
		<IconBrandGoogle aria-hidden="true" className="size-4" />
		Continue with Google
	</Button>
);
