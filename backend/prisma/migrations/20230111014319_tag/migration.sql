/*
  Warnings:

  - A unique constraint covering the columns `[label]` on the table `tag` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tag_label_key" ON "tag"("label");
