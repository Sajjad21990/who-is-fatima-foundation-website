'use client';

import dynamic from "next/dynamic";
import { Clock } from "lucide-react";

// Dynamically import PdfViewer with SSR disabled
const PdfViewer = dynamic(() => import("./PdfViewer"), {
    ssr: false,
    loading: () => (
        <div className="aspect-[1/1.4] w-full rounded-xl bg-gray-100 animate-pulse flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
                <Clock className="w-8 h-8 text-gray-300 animate-spin" />
                <p className="text-sm text-gray-400 font-medium">Preparing Viewer...</p>
            </div>
        </div>
    ),
});

interface PdfPostContentProps {
    url: string;
    title: string;
}

export function PdfPostContent({ url, title }: PdfPostContentProps) {
    return (
        <div className="w-full">
            <PdfViewer url={url} title={title} />
        </div>
    );
}
