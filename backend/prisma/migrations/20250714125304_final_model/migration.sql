/*
  Warnings:

  - You are about to drop the `Example` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InviteToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Language` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Level` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PartOfSpeech` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Translation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TranslationExample` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Word` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WordProgress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WordTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Example" DROP CONSTRAINT "Example_word_id_fkey";

-- DropForeignKey
ALTER TABLE "Language" DROP CONSTRAINT "Language_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Level" DROP CONSTRAINT "Level_language_id_fkey";

-- DropForeignKey
ALTER TABLE "PartOfSpeech" DROP CONSTRAINT "PartOfSpeech_language_id_fkey";

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_language_id_fkey";

-- DropForeignKey
ALTER TABLE "Translation" DROP CONSTRAINT "Translation_part_of_speech_id_fkey";

-- DropForeignKey
ALTER TABLE "Translation" DROP CONSTRAINT "Translation_word_id_fkey";

-- DropForeignKey
ALTER TABLE "TranslationExample" DROP CONSTRAINT "TranslationExample_exampleId_fkey";

-- DropForeignKey
ALTER TABLE "TranslationExample" DROP CONSTRAINT "TranslationExample_translationId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_invite_token_id_fkey";

-- DropForeignKey
ALTER TABLE "Word" DROP CONSTRAINT "Word_language_id_fkey";

-- DropForeignKey
ALTER TABLE "Word" DROP CONSTRAINT "Word_level_id_fkey";

-- DropForeignKey
ALTER TABLE "WordProgress" DROP CONSTRAINT "WordProgress_word_id_fkey";

-- DropForeignKey
ALTER TABLE "WordTag" DROP CONSTRAINT "WordTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "WordTag" DROP CONSTRAINT "WordTag_wordId_fkey";

-- DropTable
DROP TABLE "Example";

-- DropTable
DROP TABLE "InviteToken";

-- DropTable
DROP TABLE "Language";

-- DropTable
DROP TABLE "Level";

-- DropTable
DROP TABLE "PartOfSpeech";

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "Translation";

-- DropTable
DROP TABLE "TranslationExample";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "Word";

-- DropTable
DROP TABLE "WordProgress";

-- DropTable
DROP TABLE "WordTag";

-- CreateTable
CREATE TABLE "invite_tokens" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "time_create" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "time_expiration" TIMESTAMP(3),

    CONSTRAINT "invite_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "invite_token_id" INTEGER,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "settings" JSONB,
    "confirm_code" TEXT,
    "reset_password_token" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "time_create" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "time_edit" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "languages" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT,
    "flag" TEXT,
    "time_create" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "time_edit" TIMESTAMP(3),

    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "language_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "color" TEXT,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "words_tags" (
    "word_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "words_tags_pkey" PRIMARY KEY ("word_id","tag_id")
);

-- CreateTable
CREATE TABLE "words_progress" (
    "id" SERIAL NOT NULL,
    "word_id" INTEGER NOT NULL,
    "interval" INTEGER NOT NULL DEFAULT 1,
    "success_count" INTEGER NOT NULL DEFAULT 0,
    "failure_count" INTEGER NOT NULL DEFAULT 0,
    "timeLastReview" TIMESTAMP(3),

    CONSTRAINT "words_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "antonyms" (
    "word_id" INTEGER NOT NULL,
    "antonym_id" INTEGER NOT NULL,
    "description" TEXT,
    "time_create" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "time_edit" TIMESTAMP(3),

    CONSTRAINT "antonyms_pkey" PRIMARY KEY ("word_id","antonym_id")
);

-- CreateTable
CREATE TABLE "synonyms" (
    "word_id" INTEGER NOT NULL,
    "synonym_id" INTEGER NOT NULL,
    "description" TEXT,
    "time_create" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "time_edit" TIMESTAMP(3),

    CONSTRAINT "synonyms_pkey" PRIMARY KEY ("word_id","synonym_id")
);

-- CreateTable
CREATE TABLE "words" (
    "id" SERIAL NOT NULL,
    "language_id" INTEGER NOT NULL,
    "level_id" INTEGER,
    "formality" INTEGER,
    "complexity" INTEGER,
    "word" TEXT NOT NULL,
    "word_v2" TEXT,
    "word_v3" TEXT,
    "translation" TEXT,
    "description" TEXT,
    "transcription_strict" TEXT,
    "transcription_phonetic" TEXT,
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "time_create" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "time_edit" TIMESTAMP(3),

    CONSTRAINT "words_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "levels" (
    "id" SERIAL NOT NULL,
    "language_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "order" INTEGER NOT NULL,

    CONSTRAINT "levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parts_of_speech" (
    "id" SERIAL NOT NULL,
    "language_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,

    CONSTRAINT "parts_of_speech_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "examples" (
    "id" SERIAL NOT NULL,
    "meaning_id" INTEGER NOT NULL,
    "example" TEXT NOT NULL,
    "translation" TEXT,
    "description" TEXT,
    "time_create" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "time_edit" TIMESTAMP(3),

    CONSTRAINT "examples_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "translations" (
    "id" SERIAL NOT NULL,
    "meaning_id" INTEGER NOT NULL,
    "translation" TEXT NOT NULL,
    "description" TEXT,
    "weight" INTEGER,
    "time_create" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "time_edit" TIMESTAMP(3),

    CONSTRAINT "translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meanings" (
    "id" SERIAL NOT NULL,
    "word_id" INTEGER NOT NULL,
    "part_of_speech_id" INTEGER NOT NULL,
    "meaning" TEXT NOT NULL,
    "description" TEXT,
    "time_create" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "time_edit" TIMESTAMP(3),

    CONSTRAINT "meanings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "words_progress_word_id_key" ON "words_progress"("word_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_invite_token_id_fkey" FOREIGN KEY ("invite_token_id") REFERENCES "invite_tokens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "languages" ADD CONSTRAINT "languages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "words_tags" ADD CONSTRAINT "words_tags_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "words"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "words_tags" ADD CONSTRAINT "words_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "words_progress" ADD CONSTRAINT "words_progress_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "words"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antonyms" ADD CONSTRAINT "antonyms_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "words"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antonyms" ADD CONSTRAINT "antonyms_antonym_id_fkey" FOREIGN KEY ("antonym_id") REFERENCES "words"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "synonyms" ADD CONSTRAINT "synonyms_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "words"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "synonyms" ADD CONSTRAINT "synonyms_synonym_id_fkey" FOREIGN KEY ("synonym_id") REFERENCES "words"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "words" ADD CONSTRAINT "words_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "words" ADD CONSTRAINT "words_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "levels" ADD CONSTRAINT "levels_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parts_of_speech" ADD CONSTRAINT "parts_of_speech_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "examples" ADD CONSTRAINT "examples_meaning_id_fkey" FOREIGN KEY ("meaning_id") REFERENCES "meanings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "translations" ADD CONSTRAINT "translations_meaning_id_fkey" FOREIGN KEY ("meaning_id") REFERENCES "meanings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meanings" ADD CONSTRAINT "meanings_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "words"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meanings" ADD CONSTRAINT "meanings_part_of_speech_id_fkey" FOREIGN KEY ("part_of_speech_id") REFERENCES "parts_of_speech"("id") ON DELETE CASCADE ON UPDATE CASCADE;
