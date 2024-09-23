import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: { documentId: string } }
) {
    try {
        const { userId } = auth();
        if (!userId ||!isTeacher(userId)) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const document = await db.document.findUnique({
            where: {
                id: params.documentId,
                userId: userId,
            },
           
        });

        if (!document) {
            return new NextResponse("Not Found", { status: 404 });
        }


        const deletedDocument = await db.document.delete({
            where: {
                id: params.documentId,
            },
        });

        return NextResponse.json(deletedDocument);
    } catch (error) {
        console.log("[DOCUMENT_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { documentId: string } }
) {
    try {
        const { userId } = auth();
        const values = await req.json();

        if (!userId ||!isTeacher(userId)) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await db.document.update({
            where: {
                id: params.documentId,
                userId,
            },
            data: {
                ...values,
            },
        });

        return NextResponse.json(course);
    } catch (error) {
        console.log("[COURSE_ID_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(request: Request, { params }: { params: { documentId: string } }) {
    try {
      const { documentId } = params;
  
      if (!documentId) {
        return NextResponse.json({ error: "Document ID is required" }, { status: 400 });
      }

      const document = await db.document.findUnique({
        where: { id: documentId },
        include: {
          Attachments: true, 
        },
      });
  
      if (!document) {
        return NextResponse.json({ error: "Document not found" }, { status: 404 });
      }
  
      return NextResponse.json(document);
    } catch (error) {
      console.error("Error fetching document:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }