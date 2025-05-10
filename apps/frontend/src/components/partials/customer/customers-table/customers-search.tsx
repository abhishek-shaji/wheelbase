'use client';

import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { RiCloseCircleLine, RiSearch2Line } from '@remixicon/react';
import { cn } from '@/lib/utils';
import { useRef } from 'react';

interface CustomersSearchProps {
  isLoading: boolean;
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchClear: () => void;
}

export const CustomersSearch = ({
  isLoading,
  searchTerm,
  onSearchChange,
  onSearchClear,
}: CustomersSearchProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const id = Math.random().toString(36).substring(2, 9);

  return (
    <div className="relative">
      <Input
        id={`${id}-input`}
        ref={inputRef}
        className={cn(
          'peer min-w-60 ps-9 bg-background bg-gradient-to-br from-accent/60 to-accent',
          Boolean(searchTerm) && 'pe-9'
        )}
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search customers..."
        type="text"
        aria-label="Search customers"
        disabled={isLoading}
      />
      <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-muted-foreground/60 peer-disabled:opacity-50">
        {isLoading ? (
          <Skeleton className="h-5 w-5 rounded-full" />
        ) : (
          <RiSearch2Line size={20} aria-hidden="true" />
        )}
      </div>
      {Boolean(searchTerm) && !isLoading && (
        <button
          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/60 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Clear search"
          onClick={onSearchClear}
        >
          <RiCloseCircleLine size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
};
