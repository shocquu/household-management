-- AlterTable
ALTER TABLE "user" ALTER COLUMN "refreshToken" DROP NOT NULL,
ALTER COLUMN "refreshToken" DROP DEFAULT;
