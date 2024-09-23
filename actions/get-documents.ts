import { db } from "@/lib/db";

export const getDocuments = async () => {
  try {
    const documents = await db.document.findMany({
      where: {
        isPublished: true, 
      },
      orderBy: {
        createdAt: "desc", 
      },
      include: {
        Attachments: true, 
      },
    });

    console.log("Documents fetched:", documents); 

    return documents;

  } catch (error) {
    console.error("[GET_DOCUMENTS]", error);
    return [];
  }
};
