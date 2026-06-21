import { Link, usePage, Head } from '@inertiajs/react';
import { useState } from 'react';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { useTranslation } from '@/hooks/useTranslation';

const navigation = [
    { nameKey: 'messages.dashboard_title', href: '/admin', icon: '📊' },
    { nameKey: 'messages.admin_tenants', href: '/admin/tenants', icon: '🏢' },
    { nameKey: 'messages.admin_palettes', href: '/admin/palettes', icon: '🎨' },
    { nameKey: 'messages.admin_submissions', href: '/admin/submissions', icon: '📝' },
];

export default function RootLayout({ children }) {
    const { __ } = useTranslation();
    const { auth, flash, tenant } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const flashMessages = [
        { type: 'success', message: flash.success, color: 'bg-success bg-opacity-25 border-success text-success' },
        { type: 'error', message: flash.error, color: 'bg-danger bg-opacity-25 border-danger text-danger' },
        { type: 'warning', message: flash.warning, color: 'bg-warning bg-opacity-25 border-warning text-warning' },
        { type: 'info', message: flash.info, color: 'bg-info bg-opacity-25 border-info text-info' },
    ].filter((f) => f.message);

    return (
        <div className="min-vh-100 d-flex">
            <Head title={__('messages.admin_title')}>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            {sidebarOpen && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 zindex-40 bg-dark opacity-50 d-lg-none"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={`position-fixed top-0 start-0 zindex-50 bg-white border-end border-secondary d-lg-block position-lg-relative ${
                    sidebarOpen ? 'sidebar-open' : 'sidebar-closed'
                }`}
                style={{
                    width: '16rem',
                    transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
                    transition: 'transform 0.2s ease-in-out',
                    zIndex: 50,
                }}
            >
                <div className="d-flex align-items-center justify-content-between px-4 border-bottom border-secondary" style={{ height: '4rem' }}>
                    <Link href="/" className="fs-4 fw-bold text-primary text-decoration-none">
                        {tenant ? tenant.name : 'ColorID'}
                    </Link>
                    <button
                        className="d-lg-none btn btn-link text-secondary p-0 border-0"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <nav className="flex-grow-1 px-3 py-3 d-flex flex-column gap-1 overflow-y-auto">
                    {navigation.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="d-flex align-items-center px-3 py-2 small fw-medium rounded-3 text-secondary text-decoration-none transition"
                        >
                            <span className="me-2 fs-5">{item.icon}</span>
                            {__(item.nameKey)}
                        </Link>
                    ))}
                </nav>
            </aside>

            <div className="flex-grow-1 d-flex flex-column overflow-hidden">
                <header className="sticky-top zindex-30 flex-shrink-0 bg-white border-bottom border-secondary shadow-sm">
                    <div className="d-flex align-items-center justify-content-between px-3 px-sm-4" style={{ height: '4rem' }}>
                        <button
                            className="d-lg-none btn btn-link text-secondary p-0 border-0"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <div className="flex-grow-1" />

                        <div className="d-flex align-items-center gap-2 me-3">
                            {flashMessages.map((flash, i) => (
                                <div key={i} className={`px-3 py-1 small rounded-2 border ${flash.color}`}>
                                    {flash.message}
                                </div>
                            ))}
                        </div>

                        <LanguageSwitcher />

                        {auth.user && (
                            <div className="position-relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="d-flex align-items-center gap-2 px-3 py-2 small fw-medium text-secondary rounded-3 border-0 bg-transparent transition"
                                >
                                    <span className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center text-primary fw-semibold" style={{ width: '2rem', height: '2rem' }}>
                                        {auth.user.name.charAt(0).toUpperCase()}
                                    </span>
                                    <span className="d-none d-sm-block">{auth.user.name}</span>
                                    <svg style={{ width: '1rem', height: '1rem' }} className="text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {userMenuOpen && (
                                    <>
                                        <div className="position-fixed top-0 start-0 w-100 h-100 zindex-10" onClick={() => setUserMenuOpen(false)} />
                                        <div className="position-absolute end-0 zindex-20 mt-2 bg-white rounded-4 shadow-lg border border-secondary py-1" style={{ width: '14rem' }}>
                                            <div className="px-3 py-2 border-bottom border-light">
                                                <p className="small fw-medium text-body mb-0">{auth.user.name}</p>
                                                <p className="small text-secondary mb-0">{auth.user.email}</p>
                                            </div>
                                            <Link
                                                href="/"
                                                className="d-block px-3 py-2 small text-secondary text-decoration-none"
                                            >
                                                {__('messages.nav_back_to_site')}
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </header>

                <main className="flex-grow-1 p-3 p-sm-4 p-lg-5">
                    {children}
                </main>

                <footer className="flex-shrink-0 px-4 py-3 border-top border-secondary bg-white">
                    <p className="small text-center text-secondary mb-0">
                        {__('messages.ui_copyright', { year: String(new Date().getFullYear()) })}
                    </p>
                </footer>
            </div>
        </div>
    );
}
