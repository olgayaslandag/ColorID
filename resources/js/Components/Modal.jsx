import { useEffect, useRef, useState } from 'react';

export default function Modal({ show, maxWidth = '2xl', closeable = true, onClose, children }) {
    const dialog = useRef(null);
    const [showSlot, setShowSlot] = useState(show);

    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden';
            setShowSlot(true);
            dialog.current?.showModal();
        } else {
            document.body.style.overflow = '';
            setTimeout(() => {
                dialog.current?.close();
                setShowSlot(false);
            }, 200);
        }
    }, [show]);

    useEffect(() => {
        const closeOnEscape = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                if (show) {
                    close();
                }
            }
        };
        document.addEventListener('keydown', closeOnEscape);
        return () => {
            document.removeEventListener('keydown', closeOnEscape);
            document.body.style.overflow = '';
        };
    }, [show]);

    const close = () => {
        if (closeable && onClose) {
            onClose();
        }
    };

    const maxWidthClass = {
        sm: 'modal-sm',
        md: 'modal-md',
        lg: 'modal-lg',
        xl: 'modal-xl',
        '2xl': 'modal-2xl',
    }[maxWidth];

    return (
        <dialog
            ref={dialog}
            className="zindex-50 m-0 min-h-full min-w-full overflow-y-auto bg-transparent backdrop:bg-transparent"
        >
            <div
                className="position-fixed top-0 start-0 w-100 h-100 zindex-50 overflow-y-auto px-4 py-6 px-sm-0"
            >
                {show && (
                    <div
                        className="position-fixed top-0 start-0 w-100 h-100 transition"
                        onClick={close}
                    >
                        <div className="position-absolute top-0 start-0 w-100 h-100 bg-secondary opacity-75" />
                    </div>
                )}

                {show && (
                    <div
                        className={`mb-6 overflow-hidden rounded-3 bg-white shadow-xl transition mx-auto w-100 ${maxWidthClass || ''}`}
                    >
                        {showSlot && children}
                    </div>
                )}
            </div>
        </dialog>
    );
}
