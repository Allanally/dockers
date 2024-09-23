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
import { useState } from "react";
import { Document } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/format";

interface PriceFormProps {
    initialData: Document;
    documentId: string;
}

const formSchema = z.object({
    price: z.coerce.number(),
});

export const PriceForm = ({
    initialData, documentId
}: PriceFormProps) => {

    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing((current) => !current);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            price: initialData?.price || undefined,
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
                Document Price
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? "Cancel" : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Price
                        </>
                    )}
                </Button>
            </div>
            {!isEditing ? (
                <p className={!initialData.price ? "text-slate-500 italic" : ""}>{initialData.price ? formatPrice(initialData.price) : "No Price"}</p>
            ) : (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField control={form.control} name="price" render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input type="number" step="0.01" disabled={form.formState.isSubmitting} placeholder="Set a price for your document" {...field} />
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
