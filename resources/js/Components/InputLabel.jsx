export default function InputLabel({ value, children, htmlFor, className }) {
    return (
        <label htmlFor={htmlFor} className={`form-label fw-medium text-secondary ${className || ''}`}>
            {value || children}
        </label>
    );
}
