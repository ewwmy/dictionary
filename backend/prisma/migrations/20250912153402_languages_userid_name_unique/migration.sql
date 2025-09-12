/*
  Warnings:

  - A unique constraint covering the columns `[user_id,name]` on the table `languages` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "languages_user_id_name_key" ON "languages"("user_id", "name");
