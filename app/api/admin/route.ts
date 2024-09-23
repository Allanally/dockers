import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export async function POST(
    req: Request
){
    try{
        const { userId } = auth();
        const { title, id } = await req.json();

        if(!userId || !isTeacher(userId)){
            return new NextResponse("Unathorized", { status: 401});
        }
      
        const document = await db.document.create({
            data: {
                id: uuidv4(),
                userId,
                title,
            }
        });

        return NextResponse.json(document);
    }catch(error){
        console.log("[COURSES]", error);
        return new NextResponse("Internal Error", { status: 500})
    }
}