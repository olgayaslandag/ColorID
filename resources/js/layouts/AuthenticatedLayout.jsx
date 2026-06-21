import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { useTranslation } from '@/hooks/useTranslation';

export default function AuthenticatedLayout({ children }) {
    const { __ } = useTranslation();
    const { auth } = usePage().props;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const isDashboard = route().current('dashboard');
    const isVisualize = route().current('visualize');

    return (
        <div className="min-vh-100 bg-light">
            <nav className="sticky-top zindex-40 border-bottom border-secondary bg-white shadow-sm">
                <div className="mx-auto px-4 px-sm-6 px-lg-8" style={{ maxWidth: '80rem' }}>
                    <div className="d-flex align-items-center justify-content-between" style={{ height: '4rem' }}>
                        <div className="d-flex align-items-center gap-4">
                            <Link href={route('dashboard')} className="d-flex align-items-center gap-2 text-decoration-none">
                                <div className="d-flex align-items-center justify-content-center rounded-2 bg-brand-500 shadow-sm" style={{ width: '2rem', height: '2rem' }}>
                                    <svg className="text-white" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span className="fw-bold text-body">ColorID</span>
                            </Link>

                            <div className="d-none d-sm-flex align-items-center gap-1">
                                <Link
                                    href={route('dashboard')}
                                    className={`rounded-3 px-3 py-2 small fw-medium transition ${
                                        isDashboard ? 'bg-brand-50 text-brand-700' : 'text-secondary hover-text-body hover-bg-light'
                                    }`}
                                >
                                    {__('messages.nav_dashboard')}
                                </Link>
                                <Link
                                    href={route('visualize')}
                                    className={`rounded-3 px-3 py-2 small fw-medium transition ${
                                        isVisualize ? 'bg-brand-50 text-brand-700' : 'text-secondary hover-text-body hover-bg-light'
                                    }`}
                                >
                                    {__('messages.nav_visualize')}
                                </Link>
                            </div>
                        </div>

                        <div className="d-none d-sm-flex align-items-center gap-2">
                            <LanguageSwitcher />
                            <Link
                                href={route('profile.edit')}
                                className="rounded-3 px-3 py-2 small fw-medium text-secondary hover-text-body hover-bg-light transition"
                            >
                                {__('messages.nav_profile')}
                            </Link>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="rounded-3 bg-light px-4 py-2 small fw-medium text-secondary hover-bg-gray-200 transition"
                            >
                                {__('messages.nav_logout')}
                            </Link>
                        </div>

                        <div className="d-flex d-sm-none">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="d-inline-flex align-items-center justify-content-center rounded-4 p-2 text-secondary hover-bg-light hover-text-body transition"
                            >
                                {!showingNavigationDropdown ? (
                                    <svg width="24" height="24" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                ) : (
                                    <svg width="24" height="24" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {showingNavigationDropdown && (
                    <div className="border-top border-secondary bg-white d-sm-none">
                        <div className="d-flex flex-column gap-1 px-4 py-3">
                            <Link
                                href={route('dashboard')}
                                className={`d-block rounded-3 px-3 py-2 small fw-medium ${
                                    isDashboard ? 'bg-brand-50 text-brand-700' : 'text-secondary hover-bg-light'
                                }`}
                            >
                                {__('messages.nav_dashboard')}
                            </Link>
                            <Link
                                href={route('visualize')}
                                className={`d-block rounded-3 px-3 py-2 small fw-medium ${
                                    isVisualize ? 'bg-brand-50 text-brand-700' : 'text-secondary hover-bg-light'
                                }`}
                            >
                                {__('messages.nav_visualize')}
                            </Link>
                        </div>
                        <div className="border-top border-light px-4 py-3 d-flex flex-column gap-1">
                            <div className="px-3 py-2">
                                <p className="small fw-medium text-body mb-0">{auth.user?.name}</p>
                                <p className="text-muted small mb-0">{auth.user?.email}</p>
                            </div>
                            <Link
                                href={route('profile.edit')}
                                className="d-block rounded-3 px-3 py-2 small fw-medium text-secondary hover-bg-light"
                            >
                                {__('messages.nav_profile')}
                            </Link>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="d-block w-100 text-start rounded-3 px-3 py-2 small fw-medium text-secondary hover-bg-light"
                            >
                                {__('messages.nav_logout')}
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            <main>
                {children}
            </main>
        </div>
    );
}
