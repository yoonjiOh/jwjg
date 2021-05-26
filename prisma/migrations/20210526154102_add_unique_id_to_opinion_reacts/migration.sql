/*
  Warnings:

  - Added the required column `userOpinionId` to the `OpinionReacts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `OpinionReacts` ADD COLUMN     `userOpinionId` VARCHAR(191) NOT NULL;
