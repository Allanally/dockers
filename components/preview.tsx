"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "react-quill/dist/quill.bubble.css";

interface PreviewProps {
    value: string;
}

export const Preview = ({ value }: PreviewProps) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

    return <ReactQuill theme="bubble" value={value} readOnly />;
};
