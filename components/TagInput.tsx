// בעה"י
"use client";

import * as React from "react";
import { X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getSuggestedTags } from "@/lib/actions/tags";
import { Command as CommandPrimitive } from "cmdk";

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({ tags, setTags, placeholder = "Add tags..." }: TagInputProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<{ id: string; name: string }[]>([]);
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState("");

  const handleAddTag = (tag: string) => {
    const normalizedTag = tag.trim().toLowerCase();
    if (normalizedTag && !tags.includes(normalizedTag)) {
      setTags([...tags, normalizedTag]);
    }
    setInputValue("");
    setSelectedValue("");
    setOpen(false);
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Priority: 1. Selected suggestion from list, 2. Current input value
      if (selectedValue && open) {
        handleAddTag(selectedValue);
      } else if (inputValue) {
        handleAddTag(inputValue);
      }
    } else if (e.key === ",") {
      e.preventDefault();
      handleAddTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      handleRemoveTag(tags[tags.length - 1]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  React.useEffect(() => {
    if (inputValue.length > 1) {
      getSuggestedTags(inputValue).then((newSuggestions) => {
        setSuggestions(newSuggestions);
        setOpen(newSuggestions.length > 0);
        // Reset selected value when suggestions change
        if (newSuggestions.length > 0) {
          setSelectedValue(newSuggestions[0].name);
        } else {
          setSelectedValue("");
        }
      });
    } else {
      setSuggestions([]);
      setOpen(false);
      setSelectedValue("");
    }
  }, [inputValue]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="group flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium transition-all hover:bg-muted"
          >
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="ml-1 rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {tag}</span>
            </button>
          </Badge>
        ))}
      </div>

      <Command 
        className="overflow-visible bg-transparent" 
        value={selectedValue} 
        onValueChange={setSelectedValue}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
              <CommandPrimitive.Input
                asChild
              >
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  className="rounded-xl border-border/70 bg-background/50 pl-10 focus-visible:ring-primary/20"
                />
              </CommandPrimitive.Input>
              <Plus className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </PopoverTrigger>
          <PopoverContent 
            className="w-[--radix-popover-trigger-width] p-0" 
            align="start"
            onOpenAutoFocus={(e) => e.preventDefault()}
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <CommandList>
              <CommandGroup heading="Suggestions">
                {suggestions.map((suggestion) => (
                  <CommandItem
                    key={suggestion.id}
                    value={suggestion.name}
                    onSelect={() => handleAddTag(suggestion.name)}
                    className="cursor-pointer"
                  >
                    {suggestion.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </PopoverContent>
        </Popover>
      </Command>
      <p className="text-[12px] text-muted-foreground">
        Type and press <kbd className="rounded border bg-muted px-1 font-sans">Enter</kbd> or <kbd className="rounded border bg-muted px-1 font-sans">,</kbd> to add tags. Use arrows to navigate suggestions.
      </p>
    </div>
  );
}
