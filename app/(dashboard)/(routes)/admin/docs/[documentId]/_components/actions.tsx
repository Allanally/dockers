"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";



interface ChapterActionsProps {
    documentId: string;
    isPublished: boolean;
}

export const ChapterActions = ({
    documentId,
    isPublished = false
}: ChapterActionsProps) => {
 
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const onClick = async () => {
        try {
            setIsLoading(true)
            if(isPublished){
                await axios.patch(`/api/admin/${documentId}/unpublish`)
                toast.success("Document Unpublished")
            }else{
                await axios.patch(`/api/admin/${documentId}/publish`)
                toast.success("Document Published")
                
            }
            router.refresh()
        } catch (error) {
            toast.error("Something went wrong")
        }finally{
            setIsLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/admin/${documentId}`)
            toast.success("Chapter Deleted")
            router.refresh();
            router.push(`/admin/docs/${documentId}`)
        } catch (error) {
            toast.error("Something went wrong")
        }finally{
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-x-2">
            <Button onClick={onClick} variant="outline" size="sm" >
                {isPublished ? "Unpublish" : "Publish"}</Button>
                <ConfirmModal onConfirm={onDelete}>
                    <Button size="sm" disabled={isLoading}>
                    <Trash className="sm" />
                    </Button>
                </ConfirmModal>
                
        </div>
    )
}