ALTER TABLE `user` ADD `ad` text;--> statement-breakpoint
CREATE UNIQUE INDEX `user_ad_unique` ON `user` (`ad`);