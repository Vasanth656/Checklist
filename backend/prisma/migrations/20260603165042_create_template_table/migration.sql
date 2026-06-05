-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "templateName" TEXT NOT NULL,
    "description" TEXT,
    "questions" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);
