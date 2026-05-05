"use client";

import { Upload, X } from "lucide-react";
import { useCallback, useEffect, useState, type DragEvent } from "react";

import { cn } from "../utils";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";

export interface UploadWithDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload?: (base64: string) => void;
}

export function UploadWithDialog({
  isOpen,
  onClose,
  onUpload,
}: UploadWithDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile?.type.startsWith("image/")) {
      setFile(droppedFile);
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile?.type.startsWith("image/")) {
      setFile(selectedFile);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
  };

  async function handleSave() {
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      onUpload?.(reader.result as string);
      setLoading(false);
      setFile(null);
      setPreview(null);
      onClose();
    };
    reader.readAsDataURL(file);
  }

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Enviar Imagem</DialogTitle>
          <DialogDescription>
            Arraste e solte sua imagem aqui ou clique para selecionar.
          </DialogDescription>
        </DialogHeader>
        <div
          className={cn(
            "group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25",
            dragActive && "border-muted-foreground/50",
            file && "border-primary",
          )}
          onDragOver={(event) => {
            event.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setDragActive(false);
          }}
          onDrop={handleDrop}
          onClick={() =>
            document.getElementById("file-input-upload-dialog")?.click()
          }
        >
          <input
            id="file-input-upload-dialog"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          {preview ? (
            <div className="relative flex flex-col items-center justify-center gap-2">
              <img
                src={preview}
                alt="preview"
                width={120}
                height={120}
                className="aspect-square rounded-full object-cover"
              />
              <Button
                size="icon"
                variant="outline"
                className="absolute right-2 top-2"
                onClick={(event) => {
                  event.stopPropagation();
                  handleRemove();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
              <span className="mt-2 text-xs text-muted-foreground">
                Clique para trocar a imagem
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
              <div className="rounded-full border border-dashed p-3">
                <Upload
                  aria-hidden="true"
                  className="size-7 text-muted-foreground"
                />
              </div>
              <div className="space-y-px">
                <p className="font-medium text-muted-foreground">
                  Arraste e solte a imagem aqui ou clique para selecionar
                </p>
                <p className="text-sm text-muted-foreground/70">
                  Apenas imagens sao aceitas
                </p>
              </div>
            </div>
          )}
        </div>
        <Button
          className="mt-4 w-fit"
          disabled={loading || !file}
          onClick={handleSave}
        >
          Salvar
        </Button>
      </DialogContent>
    </Dialog>
  );
}
