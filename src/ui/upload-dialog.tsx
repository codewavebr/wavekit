"use client";

import { Upload, X } from "lucide-react";
import { useCallback, useEffect, useState, type DragEvent } from "react";
import { Button, Modal, useOverlayState } from "@heroui/react";

import { cn } from "../utils";

export type UploadWithDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpload?: (base64: string) => void;
};

export function UploadWithDialog({
  isOpen,
  onClose,
  onUpload,
}: UploadWithDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const state = useOverlayState({
    isOpen,
    onOpenChange: (open) => {
      if (!open) onClose();
    },
  });

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
    <Modal state={state}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>Upload de imagem</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Arraste uma imagem ou selecione um arquivo.
              </p>

              <div
                className={cn(
                  "relative flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border p-6 transition",
                  dragActive && "border-primary bg-primary/5",
                )}
                onDragEnter={(event) => {
                  event.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={(event) => {
                  event.preventDefault();
                  setDragActive(false);
                }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleDrop}
              >
                {preview ? (
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-48 rounded-lg object-contain"
                    />
                    <Button
                      isIconOnly
                      size="sm"
                      variant="secondary"
                      className="absolute -right-2 -top-2"
                      onPress={handleRemove}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="mb-2 size-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Solte a imagem aqui
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 cursor-pointer opacity-0"
                      onChange={handleFileChange}
                    />
                  </>
                )}
              </div>
            </Modal.Body>
            <Modal.Footer className="flex gap-2">
              <Button variant="outline" onPress={onClose} isDisabled={loading}>
                Cancelar
              </Button>
              <Button
                onPress={handleSave}
                isDisabled={!file}
                isPending={loading}
              >
                Salvar
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
