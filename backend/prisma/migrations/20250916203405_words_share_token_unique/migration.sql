/*
  Warnings:

  - A unique constraint covering the columns `[share_token]` on the table `words` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "words_share_token_key" ON "words"("share_token");
