/*
  Warnings:

  - The primary key for the `UserInfo` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `UserInfo` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`id`, `usersId`);
