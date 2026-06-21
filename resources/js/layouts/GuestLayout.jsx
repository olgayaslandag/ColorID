import { Link } from '@inertiajs/react';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { useTranslation } from '@/hooks/useTranslation';

export default function GuestLayout({ children }) {
    const { __ } = useTranslation();

    return (
        <div className="min-vh-100 d-flex flex-column" style={{ background: 'linear-gradient(to bottom right, #f9fafb, #fff, var(--bs-brand-50))' }}>
            <div className="position-absolute top-0 end-0 p-3">
                <LanguageSwitcher />
            </div>
            <div className="flex-grow-1 d-flex align-items-center justify-content-center px-4 py-12 px-sm-6 px-lg-8">
                <div className="w-100" style={{ maxWidth: '28rem' }}>
                    <div className="text-center mb-5">
                        <Link href="/" className="d-inline-flex align-items-center gap-2 text-decoration-none">
                            <div className="d-flex align-items-center justify-content-center rounded-4 bg-brand-500 shadow-sm" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <svg className="text-white" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="fs-5 fw-bold text-body">ColorID</span>
                        </Link>
                    </div>

                    <div className="rounded-4 bg-white px-5 py-5 shadow-lg border border-secondary">
                        {children}
                    </div>
                </div>
            </div>

            <footer className="px-4 py-5">
                <p className="text-center small text-muted">
                    {__('messages.ui_copyright', { year: String(new Date().getFullYear()) })}
                </p>
            </footer>
        </div>
    );
}
