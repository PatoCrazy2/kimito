"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function AddressAutocomplete({
  value,
  onChange,
  placeholder = "Busca una dirección...",
  className,
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = async (searchQuery: string) => {
    if (!searchQuery || searchQuery.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=5&addressdetails=1`
      );
      if (response.ok) {
        const data = await response.json();
        const results = data.map((item: any) => item.display_name);
        setSuggestions(results);
        setOpen(results.length > 0);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    onChange(newVal);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      fetchSuggestions(newVal);
    }, 400);
  };

  const handleSelect = (address: string) => {
    onChange(address);
    setSuggestions([]);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Input
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={className}
          onFocus={() => {
            if (suggestions.length > 0) setOpen(true);
          }}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="w-3.5 h-3.5 border-2 border-amber-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1.5 bg-white border border-border/30 rounded-xl shadow-lg max-h-60 overflow-y-auto p-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
          {suggestions.map((address, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(address)}
              className="w-full text-left px-3 py-2 text-xs font-medium text-foreground hover:bg-[#FAF9F6] hover:text-amber-primary rounded-lg transition-colors truncate"
            >
              {address}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
