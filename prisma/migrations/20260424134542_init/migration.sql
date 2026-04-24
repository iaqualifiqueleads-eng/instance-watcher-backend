-- CreateTable
CREATE TABLE `Chip` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `instance_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone_number` VARCHAR(191) NOT NULL,
    `work_space` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `system` VARCHAR(191) NOT NULL DEFAULT 'SYSTEM',
    `color` VARCHAR(191) NOT NULL DEFAULT '#D705F7',
    `celular` VARCHAR(191) NULL,

    UNIQUE INDEX `Chip_instance_id_key`(`instance_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LastStatusInstance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `instance_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone_number` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
