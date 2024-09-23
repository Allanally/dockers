"use client"
import Image from "next/image";
import Link from "next/link";

interface DocumentCardProps {
  id: string;
  title: string;
  imageUrl: string | null;
  price: number;
  description: string;
}

export const DocumentCard = ({
  id,
  title,
  imageUrl,
  price,
  description
}: DocumentCardProps) => {

  const handleLinkClick = () => {
    localStorage.setItem("documentId", id);
  };

  return (
    <Link href={`/documents/${id}`} passHref>
      <div onClick={handleLinkClick} className="group hover:shadow-sm transition overflow-hidden border rounded-e-lg p-3 h-full">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          {imageUrl ? (
            <Image 
              fill
              className="object-cover"
              alt={title}
              src={imageUrl}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span>No Image Available</span>
            </div>
          )}
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium 
          group-hover:text-sky-700 transition line-clamp-2">
            {title}
          </div>
          <p className="text-md text-muted-foreground line-clamp-3">{description}</p>
          <p className="text-md md:text-sm font-medium text-slate-500">${price}</p>
        </div>
      </div>
    </Link>
  );
};
