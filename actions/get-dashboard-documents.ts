import { db } from "@/lib/db"; 

export async function getPurchasedDocuments(userId: string) {
  return await db.document.findMany({
    where: {
      Purchases: {
        some: {
          userId: userId,
          isPurchased: true,
        },
      },
    },
    include: {
      Attachments: true, 
    },
  });
}
