import React from 'react';
import { FieldValues, useFormContext, Path } from 'react-hook-form';

import { Input } from './input';
import { Label } from './label';
import { Switch } from './switch';
import DateInput from './date-input';
import { Textarea } from './textarea';
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
    | 'select'
    | 'textarea';
  placeholder?: string;
  disabled?: boolean;
  defaultValue?: string | number;
  step?: string;
  className?: string;
  options?: SelectOption[];
}

export const FormField = <T extends FieldValues>({
  name,
  label,
  type = 'text',
  placeholder,
  disabled,
  defaultValue,
  step,
  className,
  options = [],
  ...props
}: FormFieldProps<T> &
  Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'name' | 'type'
  >): React.ReactElement => {
  const { register, formState, watch, setValue } = useFormContext<T>();
  const error = formState.errors[name];
  const errorMessage = error?.message as string | undefined;

  if (type === 'switch') {
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
    return (
      <div className="space-y-2">
        <Label htmlFor={name}>{label}</Label>
        <DateInput
          {...register(name)}
          className={`mt-1.5 ${className || ''}`}
          disabled={disabled}
          {...props}
        />
        {error && <p className="text-sm text-red-400">{errorMessage}</p>}
      </div>
    );
  }

  if (type === 'select') {
    console.log('options', options);
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

  if (type === 'textarea') {
    return (
      <div className="space-y-2">
        <Label htmlFor={name}>{label}</Label>
        <Textarea
          id={name}
          placeholder={placeholder}
          {...(register(name) as any)}
          value={watch(name) as string}
          onChange={(e) => setValue(name, e.target.value as any)}
          aria-invalid={error ? 'true' : 'false'}
          className={`mt-1.5 ${className || ''}`}
          disabled={disabled}
        />
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
