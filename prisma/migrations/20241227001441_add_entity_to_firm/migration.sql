/*
  Warnings:

  - You are about to drop the `ClientPermission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FirmPermission` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[firmId]` on the table `Entity` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[entityId]` on the table `Firm` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "FirmStatus" AS ENUM ('CERTIFIED', 'UNCERTIFIED');

-- CreateEnum
CREATE TYPE "PermissionType" AS ENUM ('READ_ONLY', 'ADMIN');

-- DropForeignKey
ALTER TABLE "ClientPermission" DROP CONSTRAINT "ClientPermission_clientId_fkey";

-- DropForeignKey
ALTER TABLE "ClientPermission" DROP CONSTRAINT "ClientPermission_userId_fkey";

-- DropForeignKey
ALTER TABLE "FirmPermission" DROP CONSTRAINT "FirmPermission_firmId_fkey";

-- DropForeignKey
ALTER TABLE "FirmPermission" DROP CONSTRAINT "FirmPermission_userId_fkey";

-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "id" SET DEFAULT 'adr_' || substr(md5(random()::text), 1, 10);

-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "id" SET DEFAULT 'c_' || substr(md5(random()::text), 1, 10);

-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "id" SET DEFAULT 'comp_' || substr(md5(random()::text), 1, 10);

-- AlterTable
ALTER TABLE "Document" ALTER COLUMN "id" SET DEFAULT 'doc_' || substr(md5(random()::text), 1, 10);

-- AlterTable
ALTER TABLE "Entity" ADD COLUMN     "firmId" TEXT,
ALTER COLUMN "id" SET DEFAULT 'e_' || substr(md5(random()::text), 1, 10);

-- AlterTable
ALTER TABLE "Firm" ADD COLUMN     "entityId" TEXT,
ADD COLUMN     "status" "FirmStatus" NOT NULL DEFAULT 'UNCERTIFIED',
ALTER COLUMN "id" SET DEFAULT 'f_' || substr(md5(random()::text), 1, 10);

-- AlterTable
ALTER TABLE "Operation" ALTER COLUMN "id" SET DEFAULT 'op_' || substr(md5(random()::text), 1, 10);

-- AlterTable
ALTER TABLE "Person" ALTER COLUMN "id" SET DEFAULT 'p_' || substr(md5(random()::text), 1, 10);

-- AlterTable
ALTER TABLE "Signatory" ALTER COLUMN "id" SET DEFAULT 'sig_' || substr(md5(random()::text), 1, 10);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT 'u_' || substr(md5(random()::text), 1, 10);

-- DropTable
DROP TABLE "ClientPermission";

-- DropTable
DROP TABLE "FirmPermission";

-- DropEnum
DROP TYPE "FirmPermissionType";

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL DEFAULT 'fp_' || substr(md5(random()::text), 1, 10),
    "firmId" TEXT,
    "clientId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "permission" "PermissionType" NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Entity_firmId_key" ON "Entity"("firmId");

-- CreateIndex
CREATE UNIQUE INDEX "Firm_entityId_key" ON "Firm"("entityId");

-- AddForeignKey
ALTER TABLE "Firm" ADD CONSTRAINT "Firm_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_firmId_fkey" FOREIGN KEY ("firmId") REFERENCES "Firm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
