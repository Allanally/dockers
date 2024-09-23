import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";
import { isTeacher } from "@/lib/teacher";

const f = createUploadthing();

const handleAuth = () => {
  const { userId } = auth();
  const isAuthorized = isTeacher(userId);
  if (!userId || !isAuthorized) throw new Error("Unauthorized");
  return { userId };
};

export const ourFileRouter = {
  documentImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(async (result) => {
      try {
        console.log("Upload completed successfully", result);
      } catch (error) {
        console.error("Error during upload completion", error);
      }
    }),
  documentAttachment: f(["text", "image", "video", "audio", "pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete(async (result) => {
      try {
        console.log("Upload completed successfully", result);
      } catch (error) {
        console.error("Error during upload completion", error);
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
