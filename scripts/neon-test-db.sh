#!/bin/sh

set -eu

if [ "$#" -lt 1 ]; then
	echo "Usage: $0 <migrate|test>" >&2
	exit 2
fi

action="$1"
branch="${NEON_TEST_BRANCH:-cineflux-test}"
database="${NEON_TEST_DATABASE:-neondb}"

if [ -n "${NEON_PROJECT_ID:-}" ]; then
	TEST_DATABASE_URL="$(
		npx neon@latest connection-string "$branch" \
			--project-id "$NEON_PROJECT_ID" \
			--database-name "$database"
	)"
else
	TEST_DATABASE_URL="$(
		npx neon@latest connection-string "$branch" \
			--database-name "$database"
	)"
fi

export DATABASE_URL="$TEST_DATABASE_URL"
export TEST_DATABASE_URL

case "$action" in
	migrate)
		exec ./node_modules/.bin/drizzle-kit migrate
		;;
	test)
		exec ./node_modules/.bin/vitest run
		;;
	*)
		echo "Unknown action: $action" >&2
		exit 2
		;;
esac
