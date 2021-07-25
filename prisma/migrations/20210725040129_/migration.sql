/*
  Warnings:

  - Added the required column `authorId` to the `Issues` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Issues` ADD COLUMN `authorId` INTEGER NOT NULL;
