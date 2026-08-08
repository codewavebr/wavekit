"use client";

import { format, type Locale } from "date-fns";
import { useState, type ButtonHTMLAttributes } from "react";
import { Button, Calendar, Popover } from "@heroui/react";
import { CalendarDate, type DateValue } from "@internationalized/date";

import { cn } from "../utils";

function toCalendarDate(date: Date): CalendarDate {
  return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

function fromDateValue(value: DateValue | null): Date | undefined {
  if (!value) return undefined;
  return new Date(value.year, value.month - 1, value.day);
}

export type SingleDayPickerProps = {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  onSelect?: (date: Date | undefined) => void;
  placeholder?: string;
  locale?: Locale;
  className?: string;
  id?: string;
  buttonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
};

export function SingleDayPicker({
  value,
  onChange,
  onSelect,
  placeholder = "Selecionar data",
  locale,
  className,
  buttonProps,
}: SingleDayPickerProps) {
  const [open, setOpen] = useState(false);
  const emit = onChange ?? onSelect;

  return (
    <Popover isOpen={open} onOpenChange={setOpen}>
      <Popover.Trigger>
        <Button
          variant="outline"
          className={cn("w-full justify-start font-normal", className)}
          {...(buttonProps as object)}
        >
          {value
            ? format(value, "PPP", locale ? { locale } : undefined)
            : placeholder}
        </Button>
      </Popover.Trigger>
      <Popover.Content className="p-2">
        <Calendar
          value={value ? toCalendarDate(value) : undefined}
          onChange={(next) => {
            emit?.(fromDateValue(next));
            setOpen(false);
          }}
        />
      </Popover.Content>
    </Popover>
  );
}
