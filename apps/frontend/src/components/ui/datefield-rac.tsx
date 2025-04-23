'use client';

import {
  composeRenderProps,
  DateFieldProps,
  DateField as DateFieldRac,
  DateInputProps as DateInputPropsRac,
  DateInput as DateInputRac,
  DateSegmentProps,
  DateSegment as DateSegmentRac,
  DateValue as DateValueRac,
  TimeFieldProps,
  TimeField as TimeFieldRac,
  TimeValue as TimeValueRac,
} from 'react-aria-components';

import { cn } from '@/lib/utils';

function DateField<T extends DateValueRac>({
  className,
  children,
  ...props
}: DateFieldProps<T>) {
  return (
    <DateFieldRac
      className={composeRenderProps(className, (className) => cn(className))}
      {...props}
    >
      {children}
    </DateFieldRac>
  );
}

function TimeField<T extends TimeValueRac>({
  className,
  children,
  ...props
}: TimeFieldProps<T>) {
  return (
    <TimeFieldRac
      className={composeRenderProps(className, (className) => cn(className))}
      {...props}
    >
      {children}
    </TimeFieldRac>
  );
}

function DateSegment({ className, ...props }: DateSegmentProps) {
  return (
    <DateSegmentRac
      className={composeRenderProps(className, (className) =>
        cn(
          'text-foreground data-focused:bg-accent data-invalid:data-focused:bg-destructive data-focused:data-placeholder:text-foreground data-focused:text-foreground data-invalid:data-placeholder:text-destructive data-invalid:text-destructive data-placeholder:text-muted-foreground/70 data-[type=literal]:text-muted-foreground/70 inline rounded p-0.5 caret-transparent outline-hidden data-disabled:cursor-not-allowed data-disabled:opacity-50 data-invalid:data-focused:text-white data-invalid:data-focused:data-placeholder:text-white data-[type=literal]:px-0',
          className
        )
      )}
      {...props}
      data-invalid
    />
  );
}

const dateInputStyle =
  "inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border border-input bg-secondary/32 shadow-xs hover:bg-secondary/64 hover:text-accent-foreground px-4 py-2 leading-6 justify-start min-w-62 w-full file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium mt-1";

interface DateInputProps extends DateInputPropsRac {
  className?: string;
  unstyled?: boolean;
}

function DateInput({
  className,
  unstyled = false,
  ...props
}: Omit<DateInputProps, 'children'>) {
  return (
    <DateInputRac
      className={composeRenderProps(className, (className) =>
        cn(!unstyled && dateInputStyle, className)
      )}
      {...props}
    >
      {(segment) => <DateSegment segment={segment} />}
    </DateInputRac>
  );
}

export { DateField, DateInput, DateSegment, TimeField, dateInputStyle };
export type { DateInputProps };
