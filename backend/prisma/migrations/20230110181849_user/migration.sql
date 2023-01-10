-- AlterTable
ALTER TABLE "user" ADD COLUMN     "dateFormat" TEXT NOT NULL DEFAULT 'dd-MM-yyyy',
ADD COLUMN     "timeFormat" TEXT NOT NULL DEFAULT 'HH:mm';
