import { Link } from "@tanstack/react-router";

export interface CastMember {
	character: string;
	id: number;
	name: string;
	profile: string | null;
}

const initials = (name: string) =>
	name
		.split(" ")
		.map((word) => word[0])
		.filter(Boolean)
		.slice(0, 2)
		.join("");

export const CastRow = ({ items }: { items: CastMember[] }) => {
	if (items.length === 0) {
		return (
			<p className="text-muted-foreground text-sm">
				No cast information available.
			</p>
		);
	}

	return (
		<div className="flex gap-4 overflow-x-auto pb-2">
			{items.map((member) => {
				const personId = String(member.id);
				return (
					<Link
						className="group block w-20 shrink-0 text-center"
						key={member.id}
						params={{ personId }}
						to="/person/$personId"
					>
						{member.profile ? (
							<img
								alt={member.name}
								className="size-20 rounded-full object-cover transition-transform group-hover:scale-105"
								decoding="async"
								loading="lazy"
								src={member.profile}
							/>
						) : (
							<span className="bg-muted text-muted-foreground flex size-20 items-center justify-center rounded-full text-lg font-semibold">
								{initials(member.name)}
							</span>
						)}
						<p className="mt-2 line-clamp-2 text-xs font-medium">
							{member.name}
						</p>
						<p className="text-muted-foreground mt-0.5 truncate text-xs">
							{member.character}
						</p>
					</Link>
				);
			})}
		</div>
	);
};
