/*
  Warnings:

  - You are about to drop the column `content` on the `HashTags` table. All the data in the column will be lost.
  - Added the required column `name` to the `HashTags` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `HashTags` DROP COLUMN `content`,
    ADD COLUMN     `name` VARCHAR(191) NOT NULL;
