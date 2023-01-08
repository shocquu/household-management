/*
  Warnings:

  - You are about to drop the column `avatar_url` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `display_name` on the `user` table. All the data in the column will be lost.
  - Added the required column `displayName` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "avatar_url",
DROP COLUMN "display_name",
ADD COLUMN     "avatarUrl" TEXT NOT NULL DEFAULT '/assets/iamges/avatars/avatar_default.jpg',
ADD COLUMN     "displayName" TEXT NOT NULL;
