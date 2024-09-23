import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params } : { params: { documentId: string, attachmentId: string }}
) {
    try {
       const { userId } = auth();
       
       if(!userId){
        return new NextResponse("Unauthorized", { status: 401 })
       }

       const documentOwner = await db.document.findUnique({
        where: {
            id: params.documentId,
            userId: userId,
        }
       });

       if(!documentOwner) {
        return new NextResponse("Unauthorized", { status: 401 })
       }

       const attachment = await db.attachment.delete({
        where: {
          docId: params.documentId,
          id: params.attachmentId,
        }
       })

       return NextResponse.json(attachment)
    } catch (error) {
        console.log("ATTACHMENTS_ID", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}