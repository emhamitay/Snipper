ALTER TABLE "snippets" DROP CONSTRAINT "snippets_title_unique";--> statement-breakpoint
CREATE UNIQUE INDEX "snippets_user_id_title_ci_unique" ON "snippets" USING btree ("user_id",lower("title"));