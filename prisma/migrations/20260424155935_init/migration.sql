/*
  Warnings:

  - Added the required column `work_space` to the `LastStatusInstance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `LastStatusInstance` ADD COLUMN `celular` VARCHAR(191) NOT NULL DEFAULT '---',
    ADD COLUMN `color` VARCHAR(191) NOT NULL DEFAULT '#D705F7',
    ADD COLUMN `system` VARCHAR(191) NOT NULL DEFAULT 'SYSTEM',
    ADD COLUMN `work_space` VARCHAR(191) NOT NULL;
