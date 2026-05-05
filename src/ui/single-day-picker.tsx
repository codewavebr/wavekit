"use client";

import { format, type Locale } from "date-fns";
import { useState } from "react";

import { cn } from "../utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

import type { ButtonHTMLAttributes } from "react";

export type SingleDayPickerProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onSelect" | "value"
> & {
  onSelect: (value: Date | undefined) => void;
  value?: Date | undefined;
  placeholder: string;
  labelVariant?: "P" | "PP" | "PPP";
  locale?: Locale;
};

const capitalizeLongWords = (value: string) =>
  value
    .split(" ")
    .map((word) =>
      word.length > 2 ? word.charAt(0).toUpperCase() + word.slice(1) : word,
    )
    .join(" ");

function SingleDayPicker({
  id,
  onSelect,
  className,
  placeholder,
  labelVariant = "PPP",
  locale,
  value,
  ...props
}: SingleDayPickerProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (date: Date | undefined) => {
    onSelect(date);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={cn(
            "group relative h-9 w-full justify-start whitespace-nowrap px-3 py-2 font-normal hover:bg-inherit",
            className,
          )}
          {...props}
        >
          {value ? (
            <span>
              {capitalizeLongWords(format(value, labelVariant, { locale }))}
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="center" className="w-fit p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export { SingleDayPicker };
