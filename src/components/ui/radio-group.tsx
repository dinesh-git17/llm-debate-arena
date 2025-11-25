// src/components/ui/radio-group.tsx
'use client'

import { cn } from '@/lib/utils'

export interface RadioOption<T extends string | number = string> {
  value: T
  label: string
  description?: string
}

interface RadioGroupProps<T extends string | number = string> {
  name: string
  options: readonly RadioOption<T>[]
  value: T
  onChange: (value: T) => void
  orientation?: 'horizontal' | 'vertical'
  error?: boolean
  className?: string
}

export function RadioGroup<T extends string | number = string>({
  name,
  options,
  value,
  onChange,
  orientation = 'vertical',
  error,
  className,
}: RadioGroupProps<T>) {
  return (
    <div
      role="radiogroup"
      className={cn(
        'flex gap-3',
        orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
        className
      )}
    >
      {options.map((option) => {
        const isSelected = value === option.value
        const inputId = `${name}-${option.value}`

        return (
          <label
            key={String(option.value)}
            htmlFor={inputId}
            className={cn(
              'relative flex cursor-pointer rounded-lg border p-4 transition-colors',
              'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background',
              isSelected
                ? 'border-primary bg-primary/5'
                : error
                  ? 'border-destructive'
                  : 'border-border hover:border-muted-foreground/50'
            )}
          >
            <input
              type="radio"
              id={inputId}
              name={name}
              value={String(option.value)}
              checked={isSelected}
              onChange={() => onChange(option.value)}
              className="sr-only"
              aria-describedby={option.description ? `${inputId}-desc` : undefined}
            />
            <span
              className={cn(
                'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border',
                isSelected ? 'border-primary' : 'border-muted-foreground/50'
              )}
              aria-hidden="true"
            >
              {isSelected && <span className="h-2 w-2 rounded-full bg-primary" />}
            </span>
            <div className="ml-3 flex flex-col">
              <span
                className={cn(
                  'text-sm font-medium',
                  isSelected ? 'text-foreground' : 'text-foreground'
                )}
              >
                {option.label}
              </span>
              {option.description && (
                <span id={`${inputId}-desc`} className="mt-0.5 text-xs text-muted-foreground">
                  {option.description}
                </span>
              )}
            </div>
          </label>
        )
      })}
    </div>
  )
}
