/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[email]` on the table `Users`. If there are existing duplicate values, the migration will fail.

*/
-- AlterTable
ALTER TABLE `Users` ADD COLUMN     `email` VARCHAR(191);

-- CreateIndex
CREATE UNIQUE INDEX `Users.email_unique` ON `Users`(`email`);
