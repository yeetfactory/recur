import * as React from 'react';
import { cn } from '@/lib/utils';
import { Platform, TextInput, type TextInputProps } from 'react-native';

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, TextInputProps>(
  ({ className, value, onChangeText, defaultValue, ...props }, ref) => {
    const initialValue = typeof value !== 'undefined' ? String(value) : (defaultValue ? String(defaultValue) : '');
    const [internalValue, setInternalValue] = React.useState(initialValue);
    const lastUpdateRef = React.useRef(0);

    React.useEffect(() => {
      if (typeof value !== 'undefined') {
        const newValue = String(value);
        if (Date.now() - lastUpdateRef.current > 500 || newValue === '') {
          setInternalValue(newValue);
        }
      }
    }, [value]);

    const handleChangeText = React.useCallback(
      (text: string) => {
        lastUpdateRef.current = Date.now();
        setInternalValue(text);
        if (onChangeText) {
          onChangeText(text);
        }
      },
      [onChangeText]
    );

    return (
      <TextInput
        ref={ref}
        value={typeof value !== 'undefined' ? internalValue : undefined}
        defaultValue={defaultValue}
        onChangeText={handleChangeText}
        className={cn(
          'dark:bg-input/30 border-input bg-background text-foreground flex h-10 w-full min-w-0 flex-row items-center rounded-md border px-3 py-1 text-base leading-5 shadow-sm shadow-black/5 sm:h-9',
          props.editable === false &&
          cn(
            'opacity-50',
            Platform.select({ web: 'disabled:pointer-events-none disabled:cursor-not-allowed' })
          ),
          Platform.select({
            web: cn(
              'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground outline-none transition-[color,box-shadow] md:text-sm',
              'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
              'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
            ),
            native: 'placeholder:text-muted-foreground/50',
          }),
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
