/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `invite_tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "invite_tokens_token_key" ON "invite_tokens"("token");
