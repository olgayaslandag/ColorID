import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Visualize() {
    const { __ } = useTranslation();

    useEffect(() => {
        const script = document.createElement('script');
        script.src = '/widget.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);

    return (
        <>
            <Head title={__('messages.visualize_title')} />

            <div className="min-vh-100" style={{ background: 'linear-gradient(to bottom right, #f9fafb, #fff, var(--bs-brand-50))' }}>
                <div className="mx-auto px-4 py-5 px-sm-6 px-lg-8" style={{ maxWidth: '48rem' }}>
                    <div className="mb-5 text-center">
                        <div className="d-inline-flex align-items-center gap-2 rounded-pill bg-brand-50 px-4 py-1 small fw-medium text-brand-700 border border-brand-200 mb-5">
                            <span className="d-inline-block rounded-circle bg-brand-500" style={{ width: '0.5rem', height: '0.5rem' }} />
                            {__('messages.visualize_badge')}
                        </div>
                        <h1 className="display-5 fw-bold text-body">{__('messages.visualize_title')}</h1>
                        <p className="mt-3 fs-6 text-muted">{__('messages.visualize_subtitle')}</p>
                    </div>

                    <div className="overflow-hidden rounded-4 bg-white shadow-lg border border-secondary">
                        <div className="p-1">
                            <div className="d-flex align-items-center gap-1 px-4 py-3 border-bottom border-light">
                                <span className="rounded-circle bg-danger" style={{ width: '0.75rem', height: '0.75rem' }} />
                                <span className="rounded-circle bg-warning" style={{ width: '0.75rem', height: '0.75rem' }} />
                                <span className="rounded-circle bg-success" style={{ width: '0.75rem', height: '0.75rem' }} />
                                <span className="ms-2 text-muted font-monospace small">{__('messages.visualize_photo_builder')}</span>
                            </div>
                            <div id="photo_builder" className="p-4" />
                        </div>
                    </div>

                    <div className="mt-5 d-flex align-items-center justify-content-center gap-2 small text-muted">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                        {__('messages.visualize_secure_notice')}
                    </div>
                </div>
            </div>
        </>
    );
}
