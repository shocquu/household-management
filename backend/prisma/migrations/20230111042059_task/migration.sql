/*
  Warnings:

  - You are about to drop the `_TagToTask` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_TagToTask" DROP CONSTRAINT "_TagToTask_A_fkey";

-- DropForeignKey
ALTER TABLE "_TagToTask" DROP CONSTRAINT "_TagToTask_B_fkey";

-- DropTable
DROP TABLE "_TagToTask";

-- CreateTable
CREATE TABLE "TaskTags" (
    "id" SERIAL NOT NULL,
    "taskId" INTEGER,
    "tagId" INTEGER,

    CONSTRAINT "TaskTags_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TaskTags" ADD CONSTRAINT "TaskTags_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskTags" ADD CONSTRAINT "TaskTags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE SET NULL ON UPDATE CASCADE;
