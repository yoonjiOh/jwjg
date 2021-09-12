-- DropForeignKey
ALTER TABLE `IssueHashTags` DROP FOREIGN KEY `IssueHashTags_ibfk_2`;

-- DropForeignKey
ALTER TABLE `IssueHashTags` DROP FOREIGN KEY `IssueHashTags_ibfk_1`;

-- DropForeignKey
ALTER TABLE `OpinionCommentReacts` DROP FOREIGN KEY `OpinionCommentReacts_ibfk_2`;

-- DropForeignKey
ALTER TABLE `OpinionCommentReacts` DROP FOREIGN KEY `OpinionCommentReacts_ibfk_1`;

-- DropForeignKey
ALTER TABLE `OpinionComments` DROP FOREIGN KEY `OpinionComments_ibfk_2`;

-- DropForeignKey
ALTER TABLE `OpinionComments` DROP FOREIGN KEY `OpinionComments_ibfk_3`;

-- DropForeignKey
ALTER TABLE `OpinionComments` DROP FOREIGN KEY `OpinionComments_ibfk_1`;

-- DropForeignKey
ALTER TABLE `OpinionReacts` DROP FOREIGN KEY `OpinionReacts_ibfk_2`;

-- DropForeignKey
ALTER TABLE `OpinionReacts` DROP FOREIGN KEY `OpinionReacts_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Opinions` DROP FOREIGN KEY `Opinions_ibfk_2`;

-- DropForeignKey
ALTER TABLE `Opinions` DROP FOREIGN KEY `Opinions_ibfk_3`;

-- DropForeignKey
ALTER TABLE `Opinions` DROP FOREIGN KEY `Opinions_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Stances` DROP FOREIGN KEY `Stances_ibfk_1`;

-- DropForeignKey
ALTER TABLE `UserInfo` DROP FOREIGN KEY `UserInfo_ibfk_1`;

-- DropForeignKey
ALTER TABLE `UserStances` DROP FOREIGN KEY `UserStances_ibfk_2`;

-- DropForeignKey
ALTER TABLE `UserStances` DROP FOREIGN KEY `UserStances_ibfk_3`;

-- DropForeignKey
ALTER TABLE `UserStances` DROP FOREIGN KEY `UserStances_ibfk_1`;

-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` VARCHAR(191),
    `access_token` VARCHAR(191),
    `expires_at` INTEGER,
    `token_type` VARCHAR(191),
    `scope` VARCHAR(191),
    `id_token` VARCHAR(191),
    `session_state` VARCHAR(191),
    `oauth_token_secret` VARCHAR(191),
    `oauth_token` VARCHAR(191),

    UNIQUE INDEX `Account.provider_providerAccountId_unique`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session.sessionToken_unique`(`sessionToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191),
    `email` VARCHAR(191),
    `emailVerified` DATETIME(3),
    `image` VARCHAR(191),

    UNIQUE INDEX `User.email_unique`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Account` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Stances` ADD FOREIGN KEY (`issuesId`) REFERENCES `Issues`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserStances` ADD FOREIGN KEY (`usersId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserStances` ADD FOREIGN KEY (`issuesId`) REFERENCES `Issues`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserStances` ADD FOREIGN KEY (`stancesId`) REFERENCES `Stances`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserInfo` ADD FOREIGN KEY (`usersId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IssueHashTags` ADD FOREIGN KEY (`issuesId`) REFERENCES `Issues`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IssueHashTags` ADD FOREIGN KEY (`hashTagsId`) REFERENCES `HashTags`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Opinions` ADD FOREIGN KEY (`usersId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Opinions` ADD FOREIGN KEY (`issuesId`) REFERENCES `Issues`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Opinions` ADD FOREIGN KEY (`stancesId`) REFERENCES `Stances`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OpinionComments` ADD FOREIGN KEY (`usersId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OpinionComments` ADD FOREIGN KEY (`opinionsId`) REFERENCES `Opinions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OpinionComments` ADD FOREIGN KEY (`stancesId`) REFERENCES `Stances`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OpinionReacts` ADD FOREIGN KEY (`usersId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OpinionReacts` ADD FOREIGN KEY (`opinionsId`) REFERENCES `Opinions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OpinionCommentReacts` ADD FOREIGN KEY (`usersId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OpinionCommentReacts` ADD FOREIGN KEY (`opinionCommentsId`) REFERENCES `OpinionComments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
