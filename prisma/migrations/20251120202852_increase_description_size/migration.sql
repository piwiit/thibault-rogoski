/*
  Warnings:

  - You are about to alter the column `category` on the `project` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE `project` MODIFY `title` VARCHAR(255) NOT NULL,
    MODIFY `category` VARCHAR(100) NOT NULL,
    MODIFY `description` TEXT NOT NULL,
    MODIFY `imageUrl` VARCHAR(500) NULL;
