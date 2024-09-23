import { Document } from "@prisma/client";
import { DocumentCard } from "./document-card";


interface DocumentsListProps {
    items: Document[];
}

export const DocumentsList = ({ items }: DocumentsListProps) => {

    return (
        <div>
           <div className="grid sm:grid-cols-2 mt-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
           {items.map((item) => (
            <div key={item.id}>
                <DocumentCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  imageUrl={item.imageUrl}
                  description={item.description!}
                  price={item.price!}
                />
            </div>
           ))}
        </div> 
        {items.length === 0 && (
            <div className="text-center text-sm text-muted-foreground mt-10">
                No Documents Found
            </div>
        )}
        </div>
    );
}