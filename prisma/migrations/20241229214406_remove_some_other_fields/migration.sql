/*
  Warnings:

  - You are about to drop the column `someOtherField` on the `Entity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "id" SET DEFAULT 'adr_' || substr(md5(random()::text), 1, 10);

-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "id" SET DEFAULT 'c_' || substr(md5(random()::text), 1, 10);

-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "id" SET DEFAULT 'comp_' || substr(md5(random()::text), 1, 10);

-- AlterTable
ALTER TABLE "Document" ALTER COLUMN "id" SET DEFAULT 'doc_' || substr(md5(random()::text), 1, 10);

-- AlterTable
ALTER TABLE "Entity" DROP COLUMN "someOtherField",
ALTER COLUMN "id" SET DEFAULT 'e_' || substr(md5(random()::text), 1, 10);

-- AlterTable
ALTER TABLE "Firm" ALTER COLUMN "id" SET DEFAULT 'f_' || substr(md5(random()::text), 1, 10);

-- AlterTable
ALTER TABLE "Operation" ALTER COLUMN "id" SET DEFAULT 'op_' || substr(md5(random()::text), 1, 10);

-- AlterTable
ALTER TABLE "Permission" ALTER COLUMN "id" SET DEFAULT 'fp_' || substr(md5(random()::text), 1, 10);

-- AlterTable
ALTER TABLE "Person" ALTER COLUMN "id" SET DEFAULT 'p_' || substr(md5(random()::text), 1, 10);

-- AlterTable
ALTER TABLE "Signatory" ALTER COLUMN "id" SET DEFAULT 'sig_' || substr(md5(random()::text), 1, 10);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT 'u_' || substr(md5(random()::text), 1, 10);
