
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NavBarRoutes } from "@/components/navbar-routes";
import { DocumentNavbar } from "./_components/document-navbar";

const DocumentLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { documentId: string };
}) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  const document = await db.document.findUnique({
    where: {
      id: params.documentId
    },
  });

  if (!document) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <div className="h-[80px]  fixed w-full z-50">
        <DocumentNavbar />
      </div>
      <div className="hidden md:flex h-full w-full flex-col fixed inset-y-0 z-50">
      </div>
      <main className=" pt-[80px] h-full">
        {children}
      </main>
    </div>
  );
};

export default DocumentLayout;
