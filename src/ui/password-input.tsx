"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button, InputGroup } from "@heroui/react";

import { cn } from "../utils";

export type PasswordInputProps = React.ComponentProps<
  typeof InputGroup.Input
> & {
  className?: string;
};

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <InputGroup className={cn("w-full", className)}>
      <InputGroup.Input
        {...props}
        type={showPassword ? "text" : "password"}
      />
      <InputGroup.Suffix>
        <Button
          isIconOnly
          type="button"
          variant="ghost"
          size="sm"
          aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          onPress={() => setShowPassword((value) => !value)}
        >
          {showPassword ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </Button>
      </InputGroup.Suffix>
    </InputGroup>
  );
}
