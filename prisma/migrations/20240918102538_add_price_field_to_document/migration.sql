-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_docId_fkey";

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "isLocked" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "price" TEXT,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "documentUrl" DROP NOT NULL,
ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_docId_fkey" FOREIGN KEY ("docId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
