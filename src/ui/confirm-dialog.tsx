"use client";

import { useState, type ReactNode } from "react";
import {
  Button,
  Modal,
  useOverlayState,
} from "@heroui/react";

export type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => Promise<void> | void;
  loading?: boolean;
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  loading: loadingProp,
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);
  const state = useOverlayState({
    isOpen: open,
    onOpenChange,
  });

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const isBusy = Boolean(loadingProp || loading);

  return (
    <Modal state={state}>
      <Modal.Backdrop isDismissable={!isBusy}>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>{title}</Modal.Heading>
            </Modal.Header>
            {description ? <Modal.Body>{description}</Modal.Body> : null}
            <Modal.Footer className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                isDisabled={isBusy}
                onPress={() => onOpenChange(false)}
              >
                {cancelText}
              </Button>
              <Button
                type="button"
                variant="danger"
                isPending={isBusy}
                onPress={handleConfirm}
              >
                {confirmText}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
