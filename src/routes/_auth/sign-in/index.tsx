// oxlint-disable react/function-component-definition func-style
import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	Link,
	useNavigate,
	useRouter,
} from "@tanstack/react-router";
import { toast } from "react-hot-toast";
import { z } from "zod";

import { GoogleSignInButton } from "#/components/auth/google-button.tsx";
import { RouteError } from "#/components/shared/route-error.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Label } from "#/components/ui/label.tsx";
import { authClient } from "#/lib/auth-client.ts";
import { getFieldMessage } from "#/lib/forms.ts";
import { fetchAuthProvidersQueryOptions } from "#/queries/auth.ts";

export const Route = createFileRoute("/_auth/sign-in/")({
	component: SignInPage,
	errorComponent: RouteError,
});

const signInSchema = z.object({
	email: z.email("Enter a valid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

function SignInPage() {
	const navigate = useNavigate();
	const router = useRouter();
	const { data: providers } = useQuery(fetchAuthProvidersQueryOptions());

	const form = useForm({
		defaultValues: { email: "", password: "" },
		validators: { onChange: signInSchema },
		onSubmit: async ({ value }) => {
			const { error } = await authClient.signIn.email(value);
			if (error) {
				toast.error(error.message ?? "Something went wrong");
				return;
			}
			await router.invalidate();
			await navigate({ to: "/" });
		},
	});

	return (
		<div className="mx-auto flex min-h-svh w-full max-w-sm flex-col justify-center px-4 pt-24 pb-6">
			<h1 className="text-3xl font-bold">Welcome back</h1>
			<p className="text-muted-foreground mt-1 text-sm">
				Sign in to sync your watchlist across devices.
			</p>

			<form
				className="mt-6 space-y-4"
				onSubmit={(event) => {
					event.preventDefault();
					void form.handleSubmit();
				}}
			>
				<form.Field name="email">
					{(field) => {
						const message = field.state.meta.isTouched
							? getFieldMessage(field.state.meta.errors)
							: "";
						return (
							<div className="space-y-1.5">
								<Label htmlFor={field.name}>Email</Label>
								<Input
									autoComplete="email"
									id={field.name}
									name={field.name}
									onBlur={field.handleBlur}
									onChange={(event) => field.handleChange(event.target.value)}
									placeholder="you@example.com"
									type="email"
									value={field.state.value}
								/>
								{message ? (
									<p className="text-destructive text-xs">{message}</p>
								) : null}
							</div>
						);
					}}
				</form.Field>

				<form.Field name="password">
					{(field) => {
						const message = field.state.meta.isTouched
							? getFieldMessage(field.state.meta.errors)
							: "";
						return (
							<div className="space-y-1.5">
								<Label htmlFor={field.name}>Password</Label>
								<Input
									autoComplete="current-password"
									id={field.name}
									name={field.name}
									onBlur={field.handleBlur}
									onChange={(event) => field.handleChange(event.target.value)}
									type="password"
									value={field.state.value}
								/>
								{message ? (
									<p className="text-destructive text-xs">{message}</p>
								) : null}
							</div>
						);
					}}
				</form.Field>

				<form.Subscribe
					selector={(state) => [state.canSubmit, state.isSubmitting]}
				>
					{([canSubmit, isSubmitting]) => (
						<Button className="w-full" disabled={!canSubmit} type="submit">
							{isSubmitting ? "Signing in…" : "Sign in"}
						</Button>
					)}
				</form.Subscribe>
			</form>

			{providers?.google ? (
				<>
					<div className="text-muted-foreground my-4 text-center text-xs">
						or
					</div>
					<GoogleSignInButton />
				</>
			) : null}

			<p className="text-muted-foreground mt-6 text-center text-sm">
				No account yet?{" "}
				<Link
					className="text-primary font-medium hover:underline"
					to="/sign-up"
				>
					Sign up
				</Link>
			</p>
		</div>
	);
}
