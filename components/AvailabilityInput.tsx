// components/ui/availability-input.tsx
"use client";

import { useState, useEffect, useTransition } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type AvailabilityStatus = "idle" | "checking" | "available" | "taken";

interface AvailabilityInputProps {
  id: string;
  label: string;
  placeholder?: string;
  type?: string;
  minLength?: number;
  checkAvailability: (value: string) => Promise<boolean>;
  onStatusChange?: (status: AvailabilityStatus) => void;
  availableMessage?: string;
  takenMessage?: string;
  debounceMs?: number;
  validate?: (value: string) => boolean;
}

export function AvailabilityInput({
  id,
  label,
  placeholder,
  type = "text",
  minLength = 3,
  checkAvailability,
  onStatusChange,
  availableMessage = "Available",
  takenMessage = "Already taken",
  debounceMs = 500,
  validate,
}: AvailabilityInputProps) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<AvailabilityStatus>("idle");
  const [isPending, startTransition] = useTransition();

  const updateStatus = (next: AvailabilityStatus) => {
    setStatus(next);
    onStatusChange?.(next);
  };

  useEffect(() => {
    if (validate) {
      if (validate(value) === false) {
        updateStatus("idle");
        return;
      }
    }

    updateStatus("checking");
    const timer = setTimeout(() => {
      startTransition(async () => {
        const available = await checkAvailability(value);
        updateStatus(available ? "available" : "taken");
      });
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={
            status === "available"
              ? "border-green-500 focus-visible:ring-green-500/50"
              : status === "taken"
                ? "border-red-500 focus-visible:ring-red-500/50"
                : ""
          }
          required
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isPending && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
          {!isPending && status === "available" && (
            <Check className="h-4 w-4 text-green-500" />
          )}
          {!isPending && status === "taken" && (
            <X className="h-4 w-4 text-red-500" />
          )}
        </div>
      </div>
      {status === "available" && (
        <p className="text-xs text-green-500">{availableMessage}</p>
      )}
      {status === "taken" && (
        <p className="text-xs text-red-500">{takenMessage}</p>
      )}
    </div>
  );
}
