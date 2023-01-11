/*
  Warnings:

  - You are about to drop the `TaskTags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TaskTags" DROP CONSTRAINT "TaskTags_tagId_fkey";

-- DropForeignKey
ALTER TABLE "TaskTags" DROP CONSTRAINT "TaskTags_taskId_fkey";

-- DropTable
DROP TABLE "TaskTags";

-- CreateTable
CREATE TABLE "_TagToTask" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TagToTask_AB_unique" ON "_TagToTask"("A", "B");

-- CreateIndex
CREATE INDEX "_TagToTask_B_index" ON "_TagToTask"("B");

-- AddForeignKey
ALTER TABLE "_TagToTask" ADD CONSTRAINT "_TagToTask_A_fkey" FOREIGN KEY ("A") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagToTask" ADD CONSTRAINT "_TagToTask_B_fkey" FOREIGN KEY ("B") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
