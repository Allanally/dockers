import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params } : { params: { documentId: string}}
){
    try {
        const { userId } = auth();
        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401})
        }
       const document = await db.document.findUnique({
            where: {
                id: params.documentId,
                userId,
            }
        })
        if(!document){
            return new NextResponse("Not Found", { status : 404})
        } 

        const unpublishedDocument = await db.document.update({
            where: {
                id: params.documentId,
                userId,
            },
            data: {
                isPublished: false
            }
        })

        return NextResponse.json(unpublishedDocument);
        
    } catch (error) {
        console.log("[DOCUMENT_ID_UNPUBLISH]", error);
        return new NextResponse("Internal Error", {status: 500})
    }
}