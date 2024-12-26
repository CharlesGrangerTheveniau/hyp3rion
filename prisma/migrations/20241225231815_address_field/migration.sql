/*
  Warnings:

  - A unique constraint covering the columns `[addressId]` on the table `Entity` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Entity_addressId_key" ON "Entity"("addressId");
