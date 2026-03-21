"use client";

import { useState, useEffect } from "react";

export default function InputField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  min,
  max,
  step,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
}) {
  const [localValue, setLocalValue] = useState(String(value));

  useEffect(() => {
    setLocalValue(String(value));
  }, [value]);

  return (
    <div>
      <label className="block text-sm text-text-secondary mb-1">{label}</label>
      {hint && <p className="text-xs text-text-muted mb-2">{hint}</p>}
      <div className="flex items-center border border-border focus-within:border-accent transition-colors">
        {prefix && <span className="pl-4 text-text-muted text-sm">{prefix}</span>}
        <input
          type="number"
          value={localValue}
          onChange={(e) => {
            setLocalValue(e.target.value);
            const n = Number(e.target.value);
            if (e.target.value !== "" && !isNaN(n)) onChange(n);
          }}
          onBlur={() => setLocalValue(String(value))}
          min={min}
          max={max}
          step={step}
          className="w-full px-4 py-3 bg-transparent text-foreground outline-none text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        {suffix && <span className="pr-4 text-text-muted text-sm">{suffix}</span>}
      </div>
    </div>
  );
}
