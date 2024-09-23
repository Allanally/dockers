import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LayoutDashboard, File, CircleDollarSign } from "lucide-react";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { AttachmentForm } from "./_components/attachment-form";
import { Banner } from "@/components/banner";
import { ChapterActions } from "./_components/actions";
import { PriceForm } from "./_components/price-form";

const DocumentPage = async ({
    params
}: {
    params: { documentId: string }
}) => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const documentId = params.documentId;

    const document = await db.document.findFirst({
        where: {
            id: documentId, 
            userId: userId,
        },
        include: {
            Attachments: {
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });
    

    if (!document) {
        return redirect("/");
    }

    const requiredFields = [
        document.title,
        document.description,
        document.imageUrl,
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `{${completedFields}/${totalFields}}`;

    return (
        <> 
         {!document.isPublished && (
            <Banner variant="warning" label="This Chapter is unplublished. It will not be visible in the course"/>
        )}
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2">
                        <h1 className="text-2xl font-medium">Document Setup</h1>
                        <span className="text-sm text-slate-700">Complete all fields {completionText}</span>
                    </div>
                    <ChapterActions documentId={params.documentId}  isPublished={document.isPublished} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className="text-xl">Customize your document</h2>
                        </div>
                        <TitleForm
                            initialData={document}
                            documentId={document.id}
                        />
                        <DescriptionForm
                            initialData={document}
                            documentId={document.id}
                        />
                        <div className="flex items-center mt-2 gap-x-2">
                        <IconBadge icon={CircleDollarSign} />
                        <h2>Sell your document</h2>
                        </div>
                        <PriceForm 
                         initialData={document}
                         documentId={document.id} />
                    </div>

                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={File} />
                                <h2 className="text-xl">
                                    Resources & Attachments
                                </h2>
                            </div>
                        </div>
                        <AttachmentForm
                            initialData={document}
                            documentId={document.id}
                        />
                        <ImageForm
                            initialData={document}
                            documentId={document.id}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default DocumentPage;
