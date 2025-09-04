'use client';

import { productStyles } from '@/components/custom/product-styles';
import { cn } from '@/lib/utils';
import { 
  SlidersHorizontal,
  Search,
  ArrowUpDown,
  Grid3x3,
  LayoutList,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FilterControlsProps {
  // Search
  searchQuery: string;
  onSearchChange: (value: string) => void;
  
  // Sort
  sortBy: string;
  sortOptions: { value: string; label: string }[];
  onSortChange: (value: string) => void;
  
  // View Mode
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  
  // Filter state
  isFilterExpanded: boolean;
  onFilterToggle: () => void;
  activeFilterCount: number;
  
  // Results
  resultCount: number;
}

export const FilterControls = ({
  searchQuery,
  onSearchChange,
  sortBy,
  sortOptions,
  onSortChange,
  viewMode,
  onViewModeChange,
  isFilterExpanded,
  onFilterToggle,
  activeFilterCount,
  resultCount
}: FilterControlsProps) => {
  return (
    <div className="rounded-lg border border-border">
      {/* Main Controls Bar */}
      <div className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Filter Toggle Button */}
          <button
            onClick={onFilterToggle}
            className={cn(
              productStyles.forms.button.md,
              "flex items-center gap-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
            )}
          >
            <SlidersHorizontal className={productStyles.forms.icon.md} />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <Badge 
                variant="secondary" 
                className={cn(productStyles.badges.size.sm, "ml-1")}
              >
                {activeFilterCount}
              </Badge>
            )}
            {isFilterExpanded ? (
              <ChevronUp className={productStyles.forms.icon.md} />
            ) : (
              <ChevronDown className={productStyles.forms.icon.md} />
            )}
          </button>

          {/* Search Bar */}
          <div className="relative hidden sm:block">
            <Search className={cn(
              productStyles.forms.icon.md,
              "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            )} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search collectibles..."
              className={cn(
                productStyles.forms.input.md,
                "pl-10 w-64 border border-input bg-background",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              )}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <div className="relative group">
            <button 
              className={cn(
                productStyles.forms.select.md,
                "flex items-center justify-between gap-2 w-48 border border-input bg-background hover:bg-accent transition-colors"
              )}
            >
              <span className="flex items-center gap-2 truncate">
                <ArrowUpDown className={productStyles.forms.icon.md} />
                <span className="truncate">
                  {sortOptions.find(o => o.value === sortBy)?.label}
                </span>
              </span>
              <ChevronDown className={cn(
                productStyles.forms.icon.md,
                "text-muted-foreground"
              )} />
            </button>
            
            {/* Sort Dropdown Menu */}
            <div className="absolute top-full mt-1 right-0 w-full bg-popover border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              {sortOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => onSortChange(option.value)}
                  className={cn(
                    "w-full px-3 py-2 text-xs text-left hover:bg-accent hover:text-accent-foreground transition-colors",
                    sortBy === option.value && "bg-accent/50 font-medium"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex border border-input rounded-md overflow-hidden">
            <button
              onClick={() => onViewModeChange('grid')}
              className={cn(
                productStyles.forms.iconButton.md,
                "rounded-none border-0",
                viewMode === 'grid'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
              aria-label="Grid view"
            >
              <Grid3x3 className={productStyles.forms.icon.md} />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={cn(
                productStyles.forms.iconButton.md,
                "rounded-none border-0 border-l border-input",
                viewMode === 'list'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
              aria-label="List view"
            >
              <LayoutList className={productStyles.forms.icon.md} />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count Bar */}
      <div className="px-3 pb-2">
        <p className={cn(productStyles.typography.meta, "font-medium")}>
          Showing <span className="text-foreground">{resultCount}</span> results
        </p>
      </div>
    </div>
  );
};

// Filter Input Component
export const FilterInput = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  className
}: {
  label: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}) => {
  return (
    <div>
      <label className={cn(productStyles.forms.label.sm, "block mb-1.5")}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          productStyles.forms.input.md,
          "w-full border border-input bg-background",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          className
        )}
      />
    </div>
  );
};

// Filter Select Component
export const FilterSelect = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select...',
  className
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; count?: number }[];
  placeholder?: string;
  className?: string;
}) => {
  return (
    <div className="relative group">
      <label className={cn(productStyles.forms.label.sm, "block mb-1.5")}>
        {label}
      </label>
      <button 
        className={cn(
          productStyles.forms.select.md,
          "w-full text-left flex items-center justify-between",
          "border border-input bg-background hover:bg-accent transition-colors",
          className
        )}
      >
        <span className="truncate">
          {value ? options.find(o => o.value === value)?.label : placeholder}
        </span>
        <ChevronDown className={cn(
          productStyles.forms.icon.md,
          "text-muted-foreground"
        )} />
      </button>
      
      <div className="absolute top-full mt-1 left-0 right-0 bg-popover border border-border rounded-md shadow-lg p-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 max-h-64 overflow-y-auto">
        <button
          onClick={() => onChange('')}
          className={cn(
            "w-full px-2 py-1.5 text-xs text-left rounded hover:bg-accent hover:text-accent-foreground transition-colors",
            !value && "bg-accent/50 font-medium"
          )}
        >
          {placeholder}
        </button>
        {options.map(option => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "w-full px-2 py-1.5 text-xs text-left rounded hover:bg-accent hover:text-accent-foreground transition-colors",
              value === option.value && "bg-accent/50 font-medium"
            )}
          >
            {option.label}
            {option.count !== undefined && (
              <span className="text-muted-foreground ml-1">({option.count})</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// Multi-select Component
export const FilterMultiSelect = ({
  label,
  values,
  onChange,
  options,
  className
}: {
  label: string;
  values: string[];
  onChange: (value: string) => void;
  options: string[];
  className?: string;
}) => {
  return (
    <div className="relative group">
      <label className={cn(productStyles.forms.label.sm, "block mb-1.5")}>
        {label}
      </label>
      <button 
        className={cn(
          productStyles.forms.select.md,
          "w-full text-left flex items-center justify-between",
          "border border-input bg-background hover:bg-accent transition-colors",
          className
        )}
      >
        <span className="truncate capitalize">
          {values.length > 0 
            ? `${values.length} selected`
            : `Select ${label.toLowerCase()}`
          }
        </span>
        <ChevronDown className={cn(
          productStyles.forms.icon.md,
          "text-muted-foreground"
        )} />
      </button>
      
      <div className="absolute top-full mt-1 left-0 right-0 bg-popover border border-border rounded-md shadow-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 max-h-64 overflow-y-auto">
        {options.map(option => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={cn(
              "w-full px-2 py-1.5 text-xs text-left rounded capitalize transition-colors",
              values.includes(option)
                ? 'bg-primary/10 text-primary font-medium'
                : 'hover:bg-accent hover:text-accent-foreground'
            )}
          >
            {option.replace('-', ' ')}
          </button>
        ))}
      </div>
    </div>
  );
};