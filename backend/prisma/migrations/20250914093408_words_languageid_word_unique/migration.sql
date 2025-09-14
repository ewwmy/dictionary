/*
  Warnings:

  - A unique constraint covering the columns `[language_id,word]` on the table `words` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "words_language_id_word_key" ON "words"("language_id", "word");
