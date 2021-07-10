/*
  Warnings:

  - You are about to drop the `UserInfo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `UserInfo` DROP FOREIGN KEY `UserInfo_ibfk_1`;

-- DropTable
DROP TABLE `UserInfo`;
