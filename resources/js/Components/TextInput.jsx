import { forwardRef, useEffect, useRef } from 'react';

const TextInput = forwardRef(function TextInput({ value, onChange, type = 'text', className, id, required, autofocus, autocomplete, placeholder, onKeyDown }, ref) {
    const inputRef = useRef(null);

    useEffect(() => {
        if (autofocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autofocus]);

    const focus = () => {
        inputRef.current?.focus();
    };

    const setRef = (el) => {
        inputRef.current = el;
        if (ref) {
            if (typeof ref === 'function') ref(el);
            else ref.current = el;
        }
    };

    return (
        <input
            id={id}
            ref={setRef}
            type={type}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            required={required}
            autoComplete={autocomplete}
            placeholder={placeholder}
            onKeyDown={onKeyDown}
            className={`form-control mt-1 ${className || ''}`}
        />
    );
});

export default TextInput;
