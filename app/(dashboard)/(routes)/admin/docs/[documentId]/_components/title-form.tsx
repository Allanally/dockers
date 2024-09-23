"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormItem, FormControl, FormField, FormMessage, FormLabel, FormDescription } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Pencil } from "lucide-react";
import { useState } from "react";


interface TitleFormProps {
    initialData: {
        title: string
    };
    documentId: string
}

const formSchema = z.object({
    title: z.string().min(1, {
      message: "Title is required",
    }),
  });
export const TitleForm = ({
    initialData, documentId
}: TitleFormProps) => {

    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current)

    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          title: "",
        },
      });

      const { isSubmitting, isValid } = form.formState;
      const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
          await axios.patch(`/api/admin/${documentId}`, values)
          toast.success("Document updated");
          toggleEdit();
          router.refresh();
        } catch (error) {
          toast.error("Something went wrong");
        }
      };

    return(
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Document Title
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && (
                        <>
                        <Pencil className="h-4 w-4 mr-2" /> 
                    Edit Title
                        </>
                    )}
                </Button>
            </div>
            {!isEditing ? (
                <p className="text-sm mt-2">{initialData.title}</p>
            ): (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input disabled={isSubmitting} placeholder="e.g 'Advanced web Development'" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <Button className="flex items-center gap-x-2" typeof="submit">
                                Save
                        </Button>
                    </form>
                </Form>
            )}

        </div>
    )
}