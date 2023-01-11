-- DropForeignKey
ALTER TABLE "TaskTags" DROP CONSTRAINT "TaskTags_tagId_fkey";

-- DropForeignKey
ALTER TABLE "TaskTags" DROP CONSTRAINT "TaskTags_taskId_fkey";

-- AddForeignKey
ALTER TABLE "TaskTags" ADD CONSTRAINT "TaskTags_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskTags" ADD CONSTRAINT "TaskTags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
