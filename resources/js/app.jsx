import '@vitejs/plugin-react-swc/preamble';
import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot, hydrateRoot } from 'react-dom/client';

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.jsx');
        const page = pages[`./pages/${name}.jsx`];

        if (!page) {
            throw new Error(`Page not found: ${name}`);
        }

        return page();
    },
    setup({ el, App, props }) {
        if (el) {
            if (import.meta.env.DEV) {
                createRoot(el).render(<App {...props} />);
            } else {
                hydrateRoot(el, <App {...props} />);
            }
        }
    },
    progress: {
        color: '#4F46E5',
        showSpinner: true,
    },
});
