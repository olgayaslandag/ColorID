import { usePage } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';

export default function LanguageSwitcher() {
    const { props } = usePage();
    const { switchLocale } = useTranslation();
    const { locale, availableLocales } = props;

    return (
        <div className="dropdown">
            <button
                className="btn btn-sm dropdown-toggle d-flex align-items-center gap-1"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ border: '1px solid var(--bs-border-color)', borderRadius: '0.375rem' }}
            >
                <span className="small">{availableLocales?.[locale] || locale}</span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
                {availableLocales && Object.entries(availableLocales).map(([code, name]) => (
                    <li key={code}>
                        <a
                            className={`dropdown-item small ${locale === code ? 'active' : ''}`}
                            href="#"
                            onClick={(e) => { e.preventDefault(); switchLocale(code); }}
                        >
                            {name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
