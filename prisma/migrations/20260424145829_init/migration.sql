/*
  Warnings:

  - You are about to drop the column `instance_id` on the `LastStatusInstance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `LastStatusInstance` DROP COLUMN `instance_id`,
    MODIFY `id` INTEGER NOT NULL;
