export default function SecondaryButton({ children, type = 'button', className, disabled, onClick }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`d-inline-flex align-items-center rounded-2 border bg-white px-3 py-2 small fw-semibold text-uppercase text-secondary shadow-sm transition hover-bg-light focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 ${className || ''}`}
        >
            {children}
        </button>
    );
}
