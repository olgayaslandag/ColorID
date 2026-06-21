import { useState, useEffect, useRef } from 'react';

export default function Dropdown({ align = 'right', width = '48', contentClasses = 'py-1 bg-white', trigger, children }) {
    const [open, setOpen] = useState(false);

    const widthClass = {
        48: 'w-48',
    }[String(width)];

    const alignmentClasses = align === 'left' ? 'start-0' : align === 'right' ? 'end-0' : '';

    useEffect(() => {
        const closeOnEscape = (e) => {
            if (open && e.key === 'Escape') {
                setOpen(false);
            }
        };
        document.addEventListener('keydown', closeOnEscape);
        return () => document.removeEventListener('keydown', closeOnEscape);
    }, [open]);

    return (
        <div className="position-relative">
            <div onClick={() => setOpen(!open)}>
                {trigger}
            </div>

            {open && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 zindex-40"
                    onClick={() => setOpen(false)}
                />
            )}

            {open && (
                <div
                    className={`position-absolute zindex-50 mt-2 rounded-1 shadow-lg ${widthClass || ''} ${alignmentClasses}`}
                    onClick={() => setOpen(false)}
                >
                    <div className={`rounded-1 ${contentClasses}`}>
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
}
