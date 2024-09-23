import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { documentId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.document.findUnique({
      where: {
        id: params.documentId,
        userId,
      }
    });

    console.log("Fetched Course:", course); 

    if (!course) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const publishedDocument = await db.document.update({
      where: {
        id: params.documentId,
        userId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedDocument);
  } catch (error) {
    console.log("[DOCUMENT_ID_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
