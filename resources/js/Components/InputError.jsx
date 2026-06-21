export default function InputError({ message, className }) {
    if (!message) return null;

    return (
        <div className={className || ''}>
            <p className="mt-1 small text-danger">{message}</p>
        </div>
    );
}
