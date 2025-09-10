-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_invite_token_id_fkey";

-- AlterTable
ALTER TABLE "invite_tokens" ADD COLUMN     "is_used" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_invite_token_id_fkey" FOREIGN KEY ("invite_token_id") REFERENCES "invite_tokens"("id") ON DELETE SET NULL ON UPDATE CASCADE;
