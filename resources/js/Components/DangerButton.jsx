export default function DangerButton({ children, className, disabled, onClick, type = 'button' }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`d-inline-flex align-items-center justify-content-center rounded-2 border-0 bg-danger px-3 py-2 small fw-semibold text-uppercase text-white transition hover-bg-red-500 focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2 active:bg-danger ${className || ''}`}
        >
            {children}
        </button>
    );
}
