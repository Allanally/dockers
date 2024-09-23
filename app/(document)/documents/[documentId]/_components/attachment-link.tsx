// components/AttachmentLink.tsx
"use client";

import { File } from "lucide-react";

interface AttachmentLinkProps {
  url: string;
  name: string;
}

export const AttachmentLink: React.FC<AttachmentLinkProps> = ({ url, name }) => {
  const handleClick = () => {
    window.location.href = url;
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center p-3 w-[60%] gap-4 bg-sky-200 border text-sky-700 rounded-md hover:underline cursor-pointer"
    >
      <File />
      <p className="line-clamp-1">{name}</p>
    </div>
  );
};
