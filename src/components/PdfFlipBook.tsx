import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import HTMLFlipBook from 'react-pageflip';
import { Loader2, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';

// Set up the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfFlipBookProps {
  file: string | Blob | null;
  onPageChange?: (page: number) => void;
  onLoadSuccess?: (numPages: number) => void;
  className?: string;
}

const PageContent = React.forwardRef<HTMLDivElement, { pageNumber: number; width: number; height: number }>((props, ref) => {
  return (
    <div className="page" ref={ref} data-density="hard">
      <div className="page-content w-full h-full bg-white shadow-inner flex items-center justify-center overflow-hidden">
        <Page 
          pageNumber={props.pageNumber} 
          width={props.width} 
          height={props.height}
          renderAnnotationLayer={false}
          renderTextLayer={false}
          loading={<div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-brand-blue" /></div>}
        />
      </div>
    </div>
  );
});

PageContent.displayName = 'PageContent';

export const PdfFlipBook: React.FC<PdfFlipBookProps> = ({ file, onPageChange, onLoadSuccess, className }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const flipBookRef = useRef<any>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setError(null);
    if (onLoadSuccess) onLoadSuccess(numPages);
  };

  const pdfOptions = useMemo(() => ({
    cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
  }), []);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        const isMobile = window.innerWidth < 768;
        const pageWidth = isMobile ? width : width / 2;
        setDimensions({ width: pageWidth, height: height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handlePageChange = useCallback((e: any) => {
    setCurrentPage(e.data);
    if (onPageChange) onPageChange(e.data + 1);
  }, [onPageChange]);

  if (!file) return null;

  return (
    <div ref={containerRef} className={cn("w-full h-full flex flex-col relative bg-slate-100 rounded-[32px] overflow-hidden", className)}>
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(err) => {
          console.error('PDF Load Error:', err);
          setError(err.message);
        }}
        options={pdfOptions}
        loading={<div className="flex items-center justify-center h-full"><Loader2 className="w-12 h-12 animate-spin text-brand-blue" /></div>}
        error={
          <div className="flex flex-col items-center justify-center h-full text-red-500 font-bold p-8 text-center">
            <p className="mb-2">PDF yuklashda xatolik yuz berdi.</p>
            <p className="text-xs font-normal text-slate-400 mb-4">
              {error || "Fayl formati noto'g'ri yoki ruxsat berilmagan bo'lishi mumkin."}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-brand-blue text-white rounded-xl text-xs font-bold"
            >
              Qayta yuklash
            </button>
          </div>
        }
      >
        {numPages > 0 && dimensions.width > 0 && (
          <HTMLFlipBook
            width={dimensions.width}
            height={dimensions.height}
            size="stretch"
            minWidth={315}
            maxWidth={1000}
            minHeight={400}
            maxHeight={1533}
            maxShadowOpacity={0.5}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={handlePageChange}
            className="flip-book mx-auto"
            ref={flipBookRef}
            startPage={0}
            drawShadow={true}
            flippingTime={1000}
            usePortrait={true}
            startZIndex={0}
            autoSize={true}
            clickEventForward={true}
            useMouseEvents={true}
            swipeDistance={30}
            showPageCorners={true}
            disableFlipByClick={false}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <PageContent 
                key={`page_${index + 1}`} 
                pageNumber={index + 1} 
                width={dimensions.width} 
                height={dimensions.height} 
              />
            ))}
          </HTMLFlipBook>
        )}
      </Document>

      {/* Controls Overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg border border-white/20 z-10">
        <button 
          onClick={() => {
            const flipBook = flipBookRef.current?.pageFlip();
            if (flipBook) flipBook.flipPrev();
          }}
          disabled={currentPage === 0}
          className="p-2 hover:bg-slate-100 rounded-xl disabled:opacity-30 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-slate-700" />
        </button>
        
        <div className="flex flex-col items-center min-w-[80px]">
          <span className="text-xs font-black text-slate-800 uppercase tracking-tighter">
            {currentPage + 1} / {numPages}
          </span>
          <div className="w-full h-1 bg-slate-200 rounded-full mt-1 overflow-hidden">
            <div 
              className="h-full bg-brand-blue transition-all duration-300" 
              style={{ width: `${((currentPage + 1) / numPages) * 100}%` }} 
            />
          </div>
        </div>

        <button 
          onClick={() => {
            const flipBook = flipBookRef.current?.pageFlip();
            if (flipBook) flipBook.flipNext();
          }}
          disabled={currentPage >= numPages - 1}
          className="p-2 hover:bg-slate-100 rounded-xl disabled:opacity-30 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-slate-700" />
        </button>
      </div>
    </div>
  );
};
