"use client";

import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Pencil, PlusCircle, ImageIcon } from "lucide-react";
import { useState } from "react";
import { Document } from "@prisma/client";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface ImageFormProps {
  initialData: Document;
  documentId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, { message: "Image is required" }),
});

export const ImageForm = ({ initialData, documentId }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: initialData?.imageUrl || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/admin/${documentId}`, values);
      toast.success("Image updated");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

    return(
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Document image
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {
                        !isEditing && !initialData.imageUrl && (
                            <>
                            <PlusCircle className="h-4 w-4 mr-2" />  
                             Add an image
                            </>
                        )
                    }
                    {!isEditing && initialData.imageUrl && (
                        <>
                        <Pencil className="h-4 w-4 mr-2" /> 
                    Edit image 
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
               !initialData.imageUrl ? (
                <div className="flex items-center justify-center h-60">
                    <ImageIcon className="h-10 w-10 text-slate-500"/> 
                </div>
               ) : (
                <div className="relative aspect-video mt-2">
                    <Image  alt="Upload" fill className="object-cover rounded-md" src={initialData.imageUrl} />
                </div>
               )
            )} {isEditing &&(
                  <div>
                    <FileUpload endpoint="documentImage" onChange={(url) => {
                        if(url){
                            onSubmit({ imageUrl: url })
                        }
                    }} />
                    <div className="text-sm text-muted-foregriund mt-4">
                        16:9 aspect ratio recommended 
                    </div>
                  </div>
            )}

        </div>
    )
}