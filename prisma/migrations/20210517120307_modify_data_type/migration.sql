/*
  Warnings:

  - Made the column `content` on table `Issues` required. The migration will fail if there are existing NULL values in that column.
  - Made the column `imageUrl` on table `Issues` required. The migration will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Issues` MODIFY `content` TEXT NOT NULL,
    MODIFY `imageUrl` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `OpinionComments` MODIFY `content` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Opinions` MODIFY `content` TEXT NOT NULL;
