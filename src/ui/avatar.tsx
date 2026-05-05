"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as React from "react";

import { cn } from "../utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className,
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn(
      "aspect-square h-full w-full object-cover object-center",
      className,
    )}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarFallback, AvatarImage };

export type AvatarWithPreviewProps = {
  src: string;
  alt: string;
  className?: string;
  fallbackText?: string;
  fallbackClassName?: string;
  previewTitle?: string;
};

export function AvatarWithPreview({
  src,
  alt,
  className,
  fallbackText,
  fallbackClassName,
  previewTitle,
}: AvatarWithPreviewProps) {
  const title = previewTitle ?? `Image preview: ${alt}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            "relative flex h-10 w-10 shrink-0 cursor-pointer overflow-hidden rounded-full transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            className,
          )}
          aria-label={title}
        >
          <Avatar className="pointer-events-none h-full w-full">
            <AvatarImage src={src} alt={alt} />
            {fallbackText ? (
              <AvatarFallback className={fallbackClassName}>
                {fallbackText}
              </AvatarFallback>
            ) : null}
          </Avatar>
        </button>
      </DialogTrigger>
      <DialogContent className="border-0 bg-transparent p-0 shadow-none md:w-fit">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <div className="flex items-center justify-center">
          <img
            src={src}
            alt={alt}
            className="max-h-[80vh] w-auto rounded-md object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
