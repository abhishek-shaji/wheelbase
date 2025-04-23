import React from 'react';
import {
  FieldValues,
  UseFormRegister,
  FieldErrors,
  Path,
  UseFormWatch,
  UseFormSetValue,
} from 'react-hook-form';

import { Input } from './input';
import { Label } from './label';
import { Calendar } from './calendar';
import { Switch } from './switch';
import DateInput from './date-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

interface SelectOption {
  value: string;
  label: string;
}

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type?:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'switch'
    | 'date'
    | 'select';
  placeholder?: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  disabled?: boolean;
  defaultValue?: string | number;
  step?: string;
  className?: string;
  // For date inputs
  watch?: UseFormWatch<T>;
  setValue?: UseFormSetValue<T>;
  // For select inputs
  options?: SelectOption[];
}

export const FormField = <T extends FieldValues>({
  name,
  label,
  type = 'text',
  placeholder,
  register,
  errors,
  disabled,
  defaultValue,
  step,
  className,
  watch,
  setValue,
  options = [],
  ...props
}: FormFieldProps<T> &
  Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'name' | 'type'
  >): React.ReactElement => {
  const error = errors[name];
  const errorMessage = error?.message as string | undefined;

  if (type === 'switch') {
    if (!setValue || !watch) {
      throw new Error('setValue and watch are required for switch fields');
    }

    const isChecked = watch(name) as boolean;

    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch
            id={name}
            checked={isChecked}
            onCheckedChange={(checked) => {
              setValue(name, checked as any);
            }}
            disabled={disabled}
          />
          <Label htmlFor={name}>{label}</Label>
        </div>
        {error && <p className="text-sm text-red-400">{errorMessage}</p>}
      </div>
    );
  }

  if (type === 'date') {
    if (!watch || !setValue) {
      throw new Error('watch and setValue are required for date fields');
    }

    return (
      <div className="space-y-2">
        <Label htmlFor={name}>{label}</Label>
        <DateInput
          {...register(name)}
          className={`mt-1.5 ${className || ''}`}
          {...props}
        />
        {error && <p className="text-sm text-red-400">{errorMessage}</p>}
      </div>
    );
  }

  if (type === 'select') {
    if (!setValue || !watch) {
      throw new Error('setValue and watch are required for select fields');
    }

    if (!options) {
      throw new Error('options are required for select fields');
    }

    const value = watch(name) as string;

    return (
      <div className="space-y-2">
        <Label htmlFor={name}>{label}</Label>
        <Select
          value={value}
          onValueChange={(value) => {
            setValue(name, value as any);
          }}
          disabled={disabled}
        >
          <SelectTrigger id={name} className={className || ''}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <p className="text-sm text-red-400">{errorMessage}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(
          name,
          type === 'number' ? { valueAsNumber: true } : undefined
        )}
        aria-invalid={error ? 'true' : 'false'}
        className={`mt-1.5 ${className || ''}`}
        disabled={disabled}
        defaultValue={defaultValue}
        step={step}
        {...props}
      />
      {error && <p className="text-sm text-red-400">{errorMessage}</p>}
    </div>
  );
};
