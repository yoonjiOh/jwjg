/*
  Warnings:

  - The primary key for the `Stances` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `Stances` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`id`, `issuesId`);

-- AddForeignKey
ALTER TABLE `Issues` ADD CONSTRAINT `Issues_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
