import '../css/app.css';
import './bootstrap';
import React from 'react';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot, hydrateRoot } from 'react-dom/client';

const el = document.getElementById('app');

// Glob desenini uygulama başlatıldığında tanımla
const pageModules = import.meta.glob('./pages/**/*.jsx', { eager: false });

createInertiaApp({
    resolve: async (name) => {
        // Mümkün olan dosya yollarını tanımla
        const pathsToTry = [
            `./pages/${name}.jsx`,
        ];

        // Özel durumlar için ek yollar ekle (örneğin index.jsx dosyaları)
        if (!name.endsWith('/Index') && !name.endsWith('/index')) {
            pathsToTry.push(
                `./pages/${name}/Index.jsx`,
                `./pages/${name}/index.jsx`
            );
        }

        // Yolları sırayla dene
        for (const path of pathsToTry) {
            if (pageModules[path]) {
                try {
                    const module = await pageModules[path]();
                    
                    // React 19 ile uyumlu export kontrolü
                    if (module && typeof module === 'object') {
                        // Default export varsa onu döndür
                        if (module.default) {
                            return module.default;
                        }
                        // Sadece bir tane export varsa onu döndür
                        const exports = Object.keys(module);
                        if (exports.length === 1) {
                            return module[exports[0]];
                        }
                        // Aksi halde modülü olduğu gibi döndür
                        return module;
                    }
                    // Module bir obje değilse doğrudan döndür
                    return module;
                } catch (error) {
                    console.error(`Error loading page: ${path}`, error);
                    throw new Error(`Failed to load page: ${name}`);
                }
            }
        }
        
        // Hiçbir yol bulunamadıysa hata fırlat
        throw new Error(`Page not found: ${name}`);
    },
    setup({ App, props }) {
        if (import.meta.env.DEV) {
            createRoot(el).render(<App {...props} />);
        } else {
            hydrateRoot(el, <App {...props} />);
        }
    },
    progress: {
        color: '#4F46E5',
        showSpinner: true,
    },
});