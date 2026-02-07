'use client';

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Loader2, AlertCircle, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Configure worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
    url: string;
    title?: string;
}

export default function PdfViewer({ url, title }: PdfViewerProps) {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [containerWidth, setContainerWidth] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const updateWidth = () => {
            const container = document.getElementById('pdf-container');
            if (container) {
                setContainerWidth(container.offsetWidth);
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setLoading(false);
    }

    function onDocumentLoadError(err: Error) {
        console.error('PDF error:', err);
        setError('Failed to load PDF document.');
        setLoading(false);
    }

    return (
        <div className="flex flex-col space-y-4">
            {/* Control Bar */}
            <div className="flex items-center justify-between bg-white/80 backdrop-blur-md p-3 rounded-xl border shadow-sm sticky top-20 z-30">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                        disabled={pageNumber <= 1}
                        className="h-8 w-8"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium text-gray-600">
                        Page {pageNumber} of {numPages || '--'}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages || prev))}
                        disabled={numPages === null || pageNumber >= numPages}
                        className="h-8 w-8"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-2 text-xs"
                        onClick={() => window.open(url, '_blank')}
                    >
                        <Maximize2 className="h-3 w-3" />
                        Popout
                    </Button>
                </div>
            </div>

            {/* Document Area */}
            <div
                id="pdf-container"
                className="bg-gray-100 rounded-2xl overflow-hidden min-h-[400px] flex items-center justify-center relative shadow-inner border border-gray-200"
            >
                {loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/50 backdrop-blur-sm z-10">
                        <Loader2 className="w-10 h-10 text-[#E63946] animate-spin mb-4" />
                        <p className="text-sm text-gray-500 font-medium">Rendering document...</p>
                    </div>
                )}

                {error && (
                    <div className="flex flex-col items-center justify-center p-12 text-center text-red-500 space-y-4">
                        <AlertCircle className="w-12 h-12" />
                        <div>
                            <p className="font-bold text-lg">Error Loading PDF</p>
                            <p className="text-sm opacity-80">{error}</p>
                        </div>
                        <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
                    </div>
                )}

                <Document
                    file={url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={null}
                    className="max-w-full"
                >
                    <Page
                        pageNumber={pageNumber}
                        width={containerWidth ? Math.min(containerWidth, 1200) : 300}
                        loading={null}
                        className="shadow-2xl"
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                    />
                </Document>
            </div>

            {/* Thumbnail Navigation (Optional - for future) */}
            {numPages && numPages > 1 && (
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3 pt-4 overflow-x-auto no-scrollbar">
                    {Array.from(new Array(numPages), (el, index) => (
                        <button
                            key={index}
                            onClick={() => setPageNumber(index + 1)}
                            className={`aspect-[1/1.41] rounded-lg border-2 transition-all overflow-hidden bg-white shadow-sm hover:shadow-md ${pageNumber === index + 1 ? 'border-[#E63946] ring-2 ring-red-100' : 'border-transparent opacity-60 hover:opacity-100'
                                }`}
                        >
                            <Document file={url} loading={null}>
                                <Page
                                    pageNumber={index + 1}
                                    width={100}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                    loading={null}
                                />
                            </Document>
                            <span className="sr-only">Go to page {index + 1}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
