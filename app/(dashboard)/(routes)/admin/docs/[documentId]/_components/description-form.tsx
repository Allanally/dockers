"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormItem, FormControl, FormField, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Pencil } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Document } from "@prisma/client";

interface DescriptionFormProps {
    initialData: Document;
    documentId: string;
}

const formSchema = z.object({
    description: z.string().min(1, { message: "Description is required" }),
});

export const DescriptionForm = ({
    initialData, documentId
}: DescriptionFormProps) => {

    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing((current) => !current);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData?.description || "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/admin/${documentId}`, values);
            toast.success("Document updated");
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Document Description
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? "Cancel" : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Description
                        </>
                    )}
                </Button>
            </div>
            {!isEditing ? (
                <p className={!initialData.description ? "text-slate-500 italic" : ""}>{initialData.description || "No Description"}</p>
            ) : (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea disabled={form.formState.isSubmitting} placeholder="Enter document description" {...field} />
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
    );
};
