import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email, phone, documentId } = await req.json();
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {

    const document = await db.document.findUnique({
      where: { id: documentId },
    });
    

    
    const notification = await db.notification.create({
      data: {
        message: `User ${name} with email ${email} and phone number ${phone} has requested to unlock document ${documentId}.`,
        type: "unlock-request",
        userId,
        isRead: false,
        documentId, 
      },
    });

    return NextResponse.json(notification, { status: 200 });
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json({ error: "Error creating notification" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const notifications = await db.notification.findMany({
      include: {
        document: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
      orderBy: { createdAt: "desc" }, 
    });

    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: "Error fetching notifications" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { documentId, userId } = await req.json(); 
    if (!userId || !documentId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    await db.notification.deleteMany({
      where: {
        documentId,
        userId,
      },
    });

    return NextResponse.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json({ error: "Error deleting notification" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const { documentId, userId } = await req.json();

  try {
    await db.notification.updateMany({
      where: {
        documentId,
        userId,
      },
      data: {
        isInteracted: true,
      },
    });

    return NextResponse.json({ message: "Notification marked as interacted" });
  } catch (error) {
    console.error("Error marking notification as interacted:", error);
    return NextResponse.json({ error: "Error marking notification as interacted" }, { status: 500 });
  }
}
