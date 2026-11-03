// src/components/Dropdown.tsx
'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

/** Shared look for storefront form controls; same size and border as the booking time buttons. */
export const FIELD_CONTROL_CLASS =
  // Fixed height rather than padding: text inputs enforce a taller minimum line height than buttons
  'product-select !py-0 h-[54px] w-full bg-[var(--bg)] text-[var(--text-1)] border-2 border-black/40 hover:border-black/60 outline-none transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30';

export type DropdownOption = { value: string; label: string };

// Roughly the open list's max height (max-h-64) plus its gap; below this much room, open upward.
const LIST_ROOM_PX = 280;

/**
 * Styled replacement for a native <select>, whose open list browsers won't let us style.
 * A hidden <select> mirrors the current value so the control still takes part in forms.
 */
export default function Dropdown({
  value,
  options,
  onChange,
  id,
  labelId,
  name,
  placeholder,
  required = false,
  invalid = false,
  className = '',
}: {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  /** id for the visible control, so a <label htmlFor> can point at it */
  id?: string;
  /** id of the visible label element */
  labelId?: string;
  name?: string;
  /** Shown while value is ''. Optional fields can also pick it from the list to clear their value. */
  placeholder?: string;
  required?: boolean;
  invalid?: boolean;
  className?: string;
}) {
  const baseId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const hasPlaceholder = placeholder !== undefined;
  const items: DropdownOption[] =
    hasPlaceholder && !required ? [{ value: '', label: placeholder }, ...options] : options;
  const selectedIndex = items.findIndex((o) => o.value === value);
  const selected = value === '' && hasPlaceholder ? undefined : items[selectedIndex];

  const openList = () => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (rect) setOpenUp(window.innerHeight - rect.bottom < LIST_ROOM_PX && rect.top > LIST_ROOM_PX);
    setActiveIndex(Math.max(selectedIndex, 0));
    setOpen(true);
  };

  const choose = (index: number) => {
    const option = items[index];
    if (option) onChange(option.value);
    setOpen(false);
  };

  // Close when pressing anywhere outside (pointerdown also covers touch, where a tap on a
  // non-clickable area may not fire mouse events)
  useEffect(() => {
    if (!open) return;
    const onDocPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDocPointerDown);
    return () => document.removeEventListener('pointerdown', onDocPointerDown);
  }, [open]);

  // Keep the keyboard-highlighted option in view in long lists
  useEffect(() => {
    if (open) listRef.current?.children[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIndex]);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, items.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveIndex(items.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        choose(activeIndex);
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        break;
      case 'Tab':
        setOpen(false);
        break;
    }
  };

  const optionId = (i: number) => `${baseId}-option-${i}`;

  return (
    <div ref={rootRef} className="relative">
      <select
        // Browsers can't report a required field that's display:none, so that case is only visually hidden
        hidden={!required}
        className={required ? 'sr-only' : undefined}
        tabIndex={-1}
        aria-hidden
        name={name}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => buttonRef.current?.focus()}
      >
        {hasPlaceholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {/* !pr-11 leaves room for the chevron against .product-select's padding */}
      <button
        ref={buttonRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${baseId}-list`}
        aria-labelledby={labelId}
        aria-activedescendant={open ? optionId(activeIndex) : undefined}
        aria-required={required || undefined}
        aria-invalid={invalid || undefined}
        disabled={items.length === 0}
        className={`${FIELD_CONTROL_CLASS} !pr-11 relative text-left cursor-pointer text-nowrap ${
          invalid ? '!border-red-500' : open ? '!border-[var(--primary)]' : ''
        } ${className}`}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
      >
        <span className={`block truncate ${selected ? '' : 'opacity-60'}`}>{selected?.label ?? placeholder ?? ' '}</span>
        <ChevronDown
          className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {open && (
        <motion.div
          ref={listRef}
          id={`${baseId}-list`}
          role="listbox"
          aria-labelledby={labelId}
          initial={{ opacity: 0, y: openUp ? 6 : -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          // preventDefault keeps focus on the button, so keyboard use continues after a click
          onMouseDown={(e) => e.preventDefault()}
          className={`absolute z-30 left-0 w-full sm:min-w-max max-h-64 overflow-y-auto p-1.5 rounded-[var(--round-xl)] bg-[var(--bg)] border-2 border-[var(--primary)] shadow-[var(--elev-2)] ${
            openUp ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
        >
          {items.map((o, i) => {
            const isSelected = i === selectedIndex && !(o.value === '' && hasPlaceholder);
            return (
              <div
                key={o.value}
                id={optionId(i)}
                role="option"
                aria-selected={isSelected}
                // Only real movement: a list scrolling under a resting pointer must not steal the keyboard highlight
                onMouseMove={(e) => {
                  if (e.movementX || e.movementY) setActiveIndex(i);
                }}
                onClick={() => choose(i)}
                className={`flex items-center justify-between gap-4 cursor-pointer rounded-xl px-4 py-2.5 text-lg transition-colors ${
                  isSelected ? 'font-semibold text-[var(--primary)]' : 'text-[var(--text-1)]'
                } ${i === activeIndex ? 'bg-[var(--bg-2)]' : ''}`}
              >
                {/* Phones: wrap long labels rather than running the list off-screen */}
                <span className="sm:text-nowrap">{o.label}</span>
                {isSelected && <Check className="w-5 h-5 flex-none" aria-hidden />}
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
