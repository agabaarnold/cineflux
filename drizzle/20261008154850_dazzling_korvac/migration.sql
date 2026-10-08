CREATE TABLE "watchlist" (
	"user_id" text,
	"media_type" text,
	"media_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "watchlist_pkey" PRIMARY KEY("user_id","media_type","media_id")
);
--> statement-breakpoint
ALTER TABLE "watchlist" ADD CONSTRAINT "watchlist_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;