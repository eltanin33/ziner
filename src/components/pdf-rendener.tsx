"use client";

import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useToast } from "./ui/use-toast";
import { useResizeDetector } from "react-resize-detector";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PdfRenderProps {
  url: string;
}

const PdfRenderer = ({ url }: PdfRenderProps) => {
  const [numPages, setNumPages] = useState(1);
  const [curPage, setCurPage] = useState(1);
  const { toast } = useToast();
  const { width, ref } = useResizeDetector();

  const handlePageChange = ({ page }: TCustomPageValidator) => {
    setCurPage(Number(page));
    setValue("page", String(page));
  };

  const CustomPageValidator = z.object({
    page: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= numPages!),
  });

  type TCustomPageValidator = z.infer<typeof CustomPageValidator>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TCustomPageValidator>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(CustomPageValidator),
  });

  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">
          <Button
            disabled={curPage <= 1}
            aria-label="previous page"
            variant="ghost"
            onClick={() => {
              setCurPage((prev) => (prev - 1 > 1 ? prev - 1 : 1));
            }}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1.5">
            <Input
              {...register("page")}
              className={cn(
                "w-12 h-8",
                errors.page && "focus-visible:ring-red-500"
              )}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(handlePageChange)();
                }
              }}
            />
            <p className="text-zinc-700 text-sm space-x-1">
              <span>/</span>
              <span>{numPages ?? "..."}</span>
            </p>
          </div>

          <Button
            disabled={curPage === numPages}
            aria-label="next page"
            variant="ghost"
            onClick={() => {
              setCurPage((prev) =>
                prev + 1 <= numPages ? prev + 1 : numPages
              );
            }}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 w-full max-h-screen">
        <div ref={ref}>
          <Document
            onLoadSuccess={({ numPages }) => {
              setNumPages(numPages);
            }}
            loading={
              <div className="flex justify-center">
                <Loader2 className="my-24 h-6 w-6 animate-spin" />
              </div>
            }
            onLoadError={() => {
              toast({
                title: "Error loading PDF",
                description: "Please try again later",
                variant: "destructive",
              });
            }}
            file={url}
            className="max-h-full"
          >
            <Page width={width ? width : 1} pageNumber={curPage} />
          </Document>
        </div>
      </div>
    </div>
  );
};

export default PdfRenderer;
