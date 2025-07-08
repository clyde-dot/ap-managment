-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER', 'OPERATOR', 'PROGRAMMER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "token" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_full_name_key" ON "users"("full_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
