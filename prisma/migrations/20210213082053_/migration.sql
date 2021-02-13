-- CreateTable
CREATE TABLE `article` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pub_time` DATETIME(3) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `thumbnail` VARCHAR(191),
    `title` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191),
    `publisher` VARCHAR(191) NOT NULL,
    `author` VARCHAR(191),
    `issue_id` INTEGER NOT NULL,
INDEX `fk_article_issue1_idx`(`issue_id`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comment` (
    `id` INTEGER NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `is_deleted` INTEGER,
    `post_id` INTEGER NOT NULL,
    `user_id` INTEGER,
    `m_time` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    `c_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
INDEX `post_id`(`post_id`),
INDEX `user_id`(`user_id`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `issue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191),
    `content` VARCHAR(191),
    `option_list_json` VARCHAR(191),
    `m_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `c_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `is_published` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `issue_has_tag` (
    `issue_id` INTEGER NOT NULL,
    `tag_id` INTEGER NOT NULL,
INDEX `fk_issue_has_tag_issue1_idx`(`issue_id`),
INDEX `fk_issue_has_tag_tag1_idx`(`tag_id`),

    PRIMARY KEY (`issue_id`,`tag_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `c_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `m_time` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    `is_deleted` INTEGER,
    `content` VARCHAR(191) NOT NULL,
    `author_id` INTEGER NOT NULL,
    `issue_id` INTEGER NOT NULL,
    `url` VARCHAR(191),
    `liked` INTEGER NOT NULL DEFAULT 0,
    `exposed` INTEGER NOT NULL DEFAULT 0,
    `clicked` INTEGER NOT NULL DEFAULT 0,
INDEX `fk_post_issue1_idx`(`issue_id`),
INDEX `fk_post_user_idx`(`author_id`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `response` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `issue_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `response` VARCHAR(191) NOT NULL,
INDEX `fk_user_issue_response_issue1_idx`(`issue_id`),
INDEX `fk_user_issue_response_user1_idx`(`user_id`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `birth_year` DATETIME(3),
    `sns` VARCHAR(191),
    `password` VARCHAR(191) NOT NULL,
    `role` INTEGER NOT NULL DEFAULT 1,
    `pic_url` VARCHAR(191),
    `info` VARCHAR(191),
    `bio` VARCHAR(191),
UNIQUE INDEX `user.email_unique`(`email`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `article` ADD FOREIGN KEY (`issue_id`) REFERENCES `issue`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD FOREIGN KEY (`post_id`) REFERENCES `post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `issue_has_tag` ADD FOREIGN KEY (`issue_id`) REFERENCES `issue`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `issue_has_tag` ADD FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post` ADD FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post` ADD FOREIGN KEY (`issue_id`) REFERENCES `issue`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `response` ADD FOREIGN KEY (`issue_id`) REFERENCES `issue`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `response` ADD FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
