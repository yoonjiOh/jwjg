/*
  Warnings:

  - A unique constraint covering the columns `[identifier,token]` on the table `VerificationRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `VerificationRequest_identifier_token_key` ON `VerificationRequest`(`identifier`, `token`);
