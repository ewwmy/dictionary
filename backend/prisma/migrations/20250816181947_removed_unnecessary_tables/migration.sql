/*
  Warnings:

  - You are about to drop the column `meaning_id` on the `examples` table. All the data in the column will be lost.
  - You are about to drop the `meanings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `parts_of_speech` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `translations` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `word_id` to the `examples` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "examples" DROP CONSTRAINT "examples_meaning_id_fkey";

-- DropForeignKey
ALTER TABLE "meanings" DROP CONSTRAINT "meanings_part_of_speech_id_fkey";

-- DropForeignKey
ALTER TABLE "meanings" DROP CONSTRAINT "meanings_word_id_fkey";

-- DropForeignKey
ALTER TABLE "parts_of_speech" DROP CONSTRAINT "parts_of_speech_language_id_fkey";

-- DropForeignKey
ALTER TABLE "translations" DROP CONSTRAINT "translations_meaning_id_fkey";

-- AlterTable
ALTER TABLE "examples" DROP COLUMN "meaning_id",
ADD COLUMN     "word_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "meanings";

-- DropTable
DROP TABLE "parts_of_speech";

-- DropTable
DROP TABLE "translations";

-- AddForeignKey
ALTER TABLE "examples" ADD CONSTRAINT "examples_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "words"("id") ON DELETE CASCADE ON UPDATE CASCADE;
