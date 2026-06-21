export default function Checkbox({ checked, value, onChange }) {
    return (
        <input
            type="checkbox"
            value={value}
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="form-check-input mt-0"
        />
    );
}
