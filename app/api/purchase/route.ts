import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = auth(); 
    const { documentId, isPurchased } = await req.json(); 

    if (!userId || !documentId || typeof isPurchased !== "boolean") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    await db.purchase.create({
      data: {
        userId,
        documentId,
        isPurchased,
      },
    });

    return NextResponse.json({ message: "Purchase created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating purchase:", error);
    return NextResponse.json({ error: "Failed to create purchase" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get("documentId");

    const { userId } = auth();

    if (!userId || !documentId) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const purchase = await db.purchase.findFirst({
      where: {
        userId,
        documentId,
        isPurchased: true,
      },
    });

    return NextResponse.json({ isPurchased: !!purchase });
  } catch (error) {
    console.error("Error checking purchase status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
