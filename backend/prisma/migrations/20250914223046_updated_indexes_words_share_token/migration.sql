CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- AlterTable
ALTER TABLE "languages" ALTER COLUMN "name" SET DATA TYPE CITEXT;

-- AlterTable
ALTER TABLE "words" ADD COLUMN     "share_token" TEXT,
ALTER COLUMN "word" SET DATA TYPE CITEXT;

-- CreateIndex
CREATE INDEX "idx_words_word_trgm" ON "words" USING GIN ("word" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "idx_words_word2_trgm" ON "words" USING GIN ("word_v2" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "idx_words_word3_trgm" ON "words" USING GIN ("word_v3" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "idx_words_translation_trgm" ON "words" USING GIN ("translation" gin_trgm_ops);
