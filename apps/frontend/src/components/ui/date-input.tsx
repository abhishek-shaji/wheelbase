'use client';

import {
  DateField,
  DateInput as DateInputRac,
  DateInputProps,
} from './datefield-rac';

export default function DateInput({
  className,
  disabled,
  ...props
}: Omit<DateInputProps, 'children'> & { disabled?: boolean }) {
  return (
    <DateField className="*:not-first:mt-2" isDisabled={disabled}>
      <DateInputRac className={className} {...props} />
    </DateField>
  );
}
