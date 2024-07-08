/*
  Warnings:

  - You are about to drop the column `userId` on the `Organisation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Organisation" DROP CONSTRAINT "Organisation_userId_fkey";

-- AlterTable
ALTER TABLE "Organisation" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "UserOrganisation" (
    "userId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserOrganisation_pkey" PRIMARY KEY ("userId","orgId")
);

-- AddForeignKey
ALTER TABLE "UserOrganisation" ADD CONSTRAINT "UserOrganisation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOrganisation" ADD CONSTRAINT "UserOrganisation_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organisation"("orgId") ON DELETE RESTRICT ON UPDATE CASCADE;
