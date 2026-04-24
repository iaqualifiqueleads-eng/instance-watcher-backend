/*
  Warnings:

  - You are about to drop the column `instance_id` on the `Instance` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Instance_instance_id_key` ON `Instance`;

-- AlterTable
ALTER TABLE `Instance` DROP COLUMN `instance_id`,
    MODIFY `id` INTEGER NOT NULL;
