-- CreateTable
CREATE TABLE `UserInfo` (
    `usersId` INTEGER NOT NULL,
    `age` INTEGER,
    `gender` VARCHAR(191),
    `residence` VARCHAR(191),

    PRIMARY KEY (`usersId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserInfo` ADD FOREIGN KEY (`usersId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
