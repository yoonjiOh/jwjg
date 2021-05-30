/*
  Warnings:

  - The migration will change the primary key for the `OpinionReacts` table. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userOpinionId` on the `OpinionReacts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `OpinionReacts` DROP PRIMARY KEY,
    DROP COLUMN `userOpinionId`,
    ADD PRIMARY KEY (`usersId`, `opinionsId`);
