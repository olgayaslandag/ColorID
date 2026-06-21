import { usePage } from '@inertiajs/react';

export function useTranslation() {
    const { props } = usePage();

    function __(key, replacements = {}) {
        const keys = key.split('.');
        let value = props.translations;

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return key;
            }
        }

        if (typeof value !== 'string') {
            return key;
        }

        for (const [search, replace] of Object.entries(replacements)) {
            value = value.replace(`:${search}`, replace);
        }

        return value;
    }

    function switchLocale(newLocale) {
        const path = window.location.pathname;
        const segments = path.split('/').filter(Boolean);
        const availableKeys = Object.keys(props.availableLocales);

        if (availableKeys.includes(segments[0])) {
            segments[0] = newLocale;
        } else {
            segments.unshift(newLocale);
        }

        const newPath = '/' + segments.join('/');
        window.location.href = newPath;
    }

    return { __, switchLocale };
}
