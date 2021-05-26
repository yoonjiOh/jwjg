/*
  Warnings:

  - The migration will change the primary key for the `OpinionReacts` table. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `OpinionReacts` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`usersId`, `opinionsId`, `userOpinionId`);
