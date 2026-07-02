import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Welcome({ canLogin, canRegister, laravelVersion, phpVersion }) {
    const { __ } = useTranslation();
    const { auth, isAdmin } = usePage().props;

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeFaq, setActiveFaq] = useState(null);

    useEffect(() => {
        const scrollHandler = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', scrollHandler, { passive: true });
        return () => window.removeEventListener('scroll', scrollHandler);
    }, []);

    const stats = [
        { value: '10K+', label: __('messages.stats_rooms_visualized') },
        { value: '98%', label: __('messages.stats_satisfaction_rate') },
        { value: '30s', label: __('messages.stats_avg_processing') },
    ];

    const features = [
        {
            icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>,
            title: __('messages.feature_upload_title'),
            desc: __('messages.feature_upload_desc'),
            bg: 'bg-blue-50',
            text: 'text-blue-600',
        },
        {
            icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5V15m0 0l3.75 3.75M9 15l-3.75-3.75M16.5 12.75V18m0 0l2.25-2.25M16.5 18l-2.25-2.25M6.75 19.5a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zm9.75-9a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" /></svg>,
            title: __('messages.feature_pick_color_title'),
            desc: __('messages.feature_pick_color_desc'),
            bg: 'bg-purple-50',
            text: 'text-purple-600',
        },
        {
            icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>,
            title: __('messages.feature_ai_generates_title'),
            desc: __('messages.feature_ai_generates_desc'),
            bg: 'bg-emerald-50',
            text: 'text-emerald-600',
        },
    ];

    const steps = [
        { num: '01', title: __('messages.step_1_title'), desc: __('messages.step_1_desc'), icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg> },
        { num: '02', title: __('messages.step_2_title'), desc: __('messages.step_2_desc'), icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg> },
        { num: '03', title: __('messages.step_3_title'), desc: __('messages.step_3_desc'), icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg> },
    ];

    const testimonials = [
        { name: __('messages.testimonial_1_name'), role: __('messages.testimonial_1_role'), company: __('messages.testimonial_1_company'), avatar: 'SM', color: 'bg-brand-500', text: __('messages.testimonial_1_text') },
        { name: __('messages.testimonial_2_name'), role: __('messages.testimonial_2_role'), company: __('messages.testimonial_2_company'), avatar: 'JC', color: 'bg-purple-500', text: __('messages.testimonial_2_text') },
        { name: __('messages.testimonial_3_name'), role: __('messages.testimonial_3_role'), company: __('messages.testimonial_3_company'), avatar: 'MR', color: 'bg-pink-500', text: __('messages.testimonial_3_text') },
    ];

    const faqs = [
        { q: __('messages.faq_1_q'), a: __('messages.faq_1_a') },
        { q: __('messages.faq_2_q'), a: __('messages.faq_2_a') },
        { q: __('messages.faq_3_q'), a: __('messages.faq_3_a') },
        { q: __('messages.faq_4_q'), a: __('messages.faq_4_a') },
        { q: __('messages.faq_5_q'), a: __('messages.faq_5_a') },
        { q: __('messages.faq_6_q'), a: __('messages.faq_6_a') },
    ];

    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    return (
        <div className="min-vh-100 bg-white">
            <Head title={__('messages.app_tagline')} />

            <header
                className={`position-fixed top-0 start-0 end-0 zindex-50 transition-all duration-300 ${scrolled ? 'bg-white border-bottom border-secondary shadow-sm' : 'bg-transparent'}`}
                style={{ backdropFilter: 'blur(24px)' }}
            >
                <div className="mx-auto px-4 px-sm-6 px-lg-8" style={{ maxWidth: '80rem' }}>
                    <div className="d-flex align-items-center justify-content-between" style={{ height: '4rem' }}>
                        <Link href="/" className="d-flex align-items-center gap-2 text-decoration-none">
                            <div className="d-flex align-items-center justify-content-center rounded-4 bg-brand-500 shadow-sm transition scale-105-hover" style={{ width: '2.25rem', height: '2.25rem' }}>
                                <svg className="text-white" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="fw-bold text-body">ColorID</span>
                        </Link>

                        <nav className="d-none d-md-flex align-items-center gap-1">
                            <a href="#features" className="btn btn-sm btn-ghost rounded-4">{__('messages.nav_features')}</a>
                            <a href="#how-it-works" className="btn btn-sm btn-ghost rounded-4">{__('messages.nav_how_it_works')}</a>
                            <a href="#testimonials" className="btn btn-sm btn-ghost rounded-4">{__('messages.nav_testimonials')}</a>
                            <a href="#faq" className="btn btn-sm btn-ghost rounded-4">{__('messages.nav_faq')}</a>
                        </nav>

                        <div className="d-none d-md-flex align-items-center gap-2">
                            {canLogin && (
                                auth.user ? (
                                    <div className="d-flex align-items-center gap-2">
                                        {isAdmin && (
                                            <Link href={route('admin.dashboard')} className="btn btn-sm btn-ghost rounded-4">
                                                {__('messages.nav_dashboard')}
                                            </Link>
                                        )}
                                        <Link href={route('visualize')} className="btn btn-sm btn-primary rounded-4">
                                            {__('messages.nav_visualize')}
                                        </Link>
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="btn btn-secondary btn-sm rounded-4"
                                        >
                                            {__('messages.nav_logout')}
                                        </Link>
                                    </div>
                                ) : (
                                    <>
                                        <Link href={route('login')} className="btn-ghost small">
                                            {__('messages.nav_login')}
                                        </Link>
                                        {canRegister && (
                                            <Link href={route('register')} className="btn-primary small px-4 py-2">
                                                {__('messages.nav_get_started')}
                                            </Link>
                                        )}
                                    </>
                                )
                            )}
                        </div>

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="d-md-none position-relative zindex-50 d-inline-flex align-items-center justify-content-center rounded-4 p-2 text-secondary hover-bg-light transition"
                            aria-label={__('messages.nav_toggle_menu')}
                        >
                            {!mobileMenuOpen ? (
                                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            ) : (
                                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {mobileMenuOpen && (
                <div className="position-fixed top-0 start-0 w-100 h-100 zindex-40 d-md-none" onClick={() => setMobileMenuOpen(false)} style={{ backgroundColor: 'rgba(17,24,39,0.4)', backdropFilter: 'blur(4px)' }} />
            )}

            {mobileMenuOpen && (
                <div className="position-fixed zindex-40 d-md-none rounded-5 bg-white shadow-lg border border-secondary p-4" style={{ top: '5rem', left: '1rem', right: '1rem' }}>
                    <nav className="d-flex flex-column gap-1">
                        <a href="#features" onClick={() => setMobileMenuOpen(false)} className="rounded-4 px-4 py-3 small fw-medium text-secondary hover-bg-light transition text-decoration-none">{__('messages.nav_features')}</a>
                        <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="rounded-4 px-4 py-3 small fw-medium text-secondary hover-bg-light transition text-decoration-none">{__('messages.nav_how_it_works')}</a>
                        <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="rounded-4 px-4 py-3 small fw-medium text-secondary hover-bg-light transition text-decoration-none">{__('messages.nav_testimonials')}</a>
                        <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="rounded-4 px-4 py-3 small fw-medium text-secondary hover-bg-light transition text-decoration-none">{__('messages.nav_faq')}</a>
                    </nav>
                    <div className="mt-4 pt-4 border-top border-light d-flex flex-column gap-2">
                        {canLogin && (
                            auth.user ? (
                                <div className="d-flex flex-column gap-2">
                                    {isAdmin && (
                                        <Link href={route('admin.dashboard')} onClick={() => setMobileMenuOpen(false)} className="btn-ghost small px-3 py-2 w-100 justify-content-center">
                                            {__('messages.nav_dashboard')}
                                        </Link>
                                    )}
                                    <Link href={route('visualize')} onClick={() => setMobileMenuOpen(false)} className="btn-primary w-100 justify-content-center">
                                        {__('messages.nav_visualize')}
                                    </Link>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="btn-ghost small px-3 py-2 w-100 justify-content-center"
                                    >
                                        {__('messages.nav_logout')}
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <Link href={route('login')} onClick={() => setMobileMenuOpen(false)} className="btn-secondary w-100 justify-content-center small">
                                        {__('messages.nav_login')}
                                    </Link>
                                    {canRegister && (
                                        <Link href={route('register')} onClick={() => setMobileMenuOpen(false)} className="btn-primary w-100 justify-content-center small">
                                        {__('messages.nav_get_started_free')}
                                    </Link>
                                    )}
                                </>
                            )
                        )}
                    </div>
                </div>
            )}

            <section className="position-relative overflow-hidden d-flex align-items-center pt-20" style={{ minHeight: '90vh' }}>
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: -10 }}>
                    <div className="position-absolute rounded-circle" style={{ width: '500px', height: '500px', top: '-10rem', right: '-10rem', background: 'linear-gradient(to bottom right, rgba(196, 181, 253, 0.4), rgba(216, 180, 254, 0.3), transparent)', filter: 'blur(64px)' }} />
                    <div className="position-absolute rounded-circle" style={{ width: '500px', height: '500px', bottom: '-10rem', left: '-10rem', background: 'linear-gradient(to top right, rgba(249, 168, 212, 0.3), rgba(196, 181, 253, 0.2), transparent)', filter: 'blur(64px)' }} />
                </div>

                <div className="container-wide px-4 px-sm-6 px-lg-8">
                    <div className="mx-auto text-center" style={{ maxWidth: '56rem' }}>
                        <div className="d-inline-flex align-items-center gap-2 rounded-pill bg-brand-50 px-4 py-1 small fw-medium text-brand-700 border border-brand-200 mb-5 animate-fade-in-down">
                            <span className="d-inline-block rounded-circle bg-brand-500 animate-pulse-soft" style={{ width: '0.5rem', height: '0.5rem' }} />
                            {__('messages.hero_badge')}
                        </div>

                        <h1 className="fw-bold text-body text-balance animate-fade-in-up lh-sm" style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', letterSpacing: '-0.02em' }}>
                            {__('messages.hero_title_line1')}<br />
                            <span className="gradient-text">{__('messages.hero_title_highlight')}</span>
                            <span className="text-body"> {__('messages.hero_title_line2')}</span>
                        </h1>

                        <p className="mx-auto mt-4 text-muted animate-fade-in-up animation-delay-200 lh-lg" style={{ maxWidth: '36rem', fontSize: 'clamp(1rem, 1.5vw, 1.25rem)' }}>
                            {__('messages.hero_subtitle')}
                            <span className="d-none d-sm-inline">{__('messages.hero_subtitle_extra')}</span>
                        </p>

                        <div className="mt-5 d-flex flex-column flex-sm-row align-items-center justify-content-center gap-3 animate-fade-in-up animation-delay-300">
                            {auth.user ? (
                                <Link href={route('visualize')} className="btn-primary px-4 py-3 w-100 w-sm-auto" style={{ fontSize: '1rem' }}>
                                    {__('messages.hero_cta_authenticated')}
                                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </Link>
                            ) : (
                                <>
                                    {canRegister && (
                                        <Link href={route('register')} className="btn-primary px-4 py-3 w-100 w-sm-auto" style={{ fontSize: '1rem' }}>
                                            {__('messages.hero_cta_guest')}
                                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                            </svg>
                                        </Link>
                                    )}
                                    <a href="#how-it-works" className="btn-secondary px-4 py-3 w-100 w-sm-auto" style={{ fontSize: '1rem' }}>
                                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" />
                                        </svg>
                                        {__('messages.hero_how_it_works')}
                                    </a>
                                </>
                            )}
                        </div>

                        <p className="mt-4 small text-muted animate-fade-in-up animation-delay-500">
                            {__('messages.hero_credit_note')}
                        </p>
                    </div>
                </div>
            </section>

            <section className="section-padding position-relative">
                <div className="container-wide">
                    <div className="row row-cols-3 row-cols-md-3 g-5 justify-content-center">
                        {stats.map((stat, i) => (
                            <div key={stat.label} className="card-hover p-4 p-sm-5 text-center animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                                <p className="gradient-text-simple fw-bold" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>{stat.value}</p>
                                <p className="mt-2 small text-muted fw-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="features" className="section-padding" style={{ background: 'linear-gradient(to bottom, rgba(249,250,251,0.5), #fff)' }}>
                <div className="container-wide">
                    <div className="text-center mx-auto" style={{ maxWidth: '36rem' }}>
                        <span className="d-inline-flex align-items-center gap-2 rounded-pill bg-brand-50 px-4 py-1 small fw-medium text-brand-700 border border-brand-200 mb-4">{__('messages.features_badge')}</span>
                        <h2 className="fw-bold text-body text-balance" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', letterSpacing: '-0.02em' }}>{__('messages.features_title')}</h2>
                        <p className="mt-3 text-muted" style={{ fontSize: '1.125rem' }}>{__('messages.features_subtitle')}</p>
                    </div>
                    <div className="mt-5 row g-4 g-sm-5 row-cols-md-3 justify-content-center">
                        {features.map((feature, i) => (
                            <div key={feature.title} className="position-relative card-hover p-5 animate-fade-in-up" style={{ animationDelay: `${i * 150}ms` }}>
                                <div className={`d-inline-flex align-items-center justify-content-center rounded-4 ${feature.bg} ${feature.text}`} style={{ width: '3.5rem', height: '3.5rem', marginBottom: '1.25rem' }}>
                                    {feature.icon}
                                </div>
                                <h3 className="fs-5 fw-semibold text-body">{feature.title}</h3>
                                <p className="mt-2 text-secondary lh-lg">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="how-it-works" className="section-padding position-relative overflow-hidden">
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: -10 }}>
                    <div className="position-absolute rounded-circle" style={{ width: '400px', height: '400px', top: '-10rem', right: '-10rem', background: 'linear-gradient(to bottom left, rgba(196, 181, 253, 0.4), rgba(216, 180, 254, 0.2), transparent)', filter: 'blur(64px)' }} />
                    <div className="position-absolute rounded-circle" style={{ width: '400px', height: '400px', bottom: '-10rem', left: '-10rem', background: 'linear-gradient(to top right, rgba(216, 180, 254, 0.3), rgba(196, 181, 253, 0.2), transparent)', filter: 'blur(64px)' }} />
                </div>
                <div className="container-wide">
                    <div className="text-center mx-auto" style={{ maxWidth: '36rem' }}>
                        <span className="d-inline-flex align-items-center gap-2 rounded-pill bg-brand-50 px-4 py-1 small fw-medium text-brand-700 border border-brand-200 mb-4">{__('messages.how_it_works_badge')}</span>
                        <h2 className="fw-bold text-body text-balance" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', letterSpacing: '-0.02em' }}>{__('messages.how_it_works_title')}</h2>
                        <p className="mt-3 text-muted" style={{ fontSize: '1.125rem' }}>{__('messages.how_it_works_subtitle')}</p>
                    </div>
                    <div className="mt-5 row g-4 row-cols-md-3 position-relative">
                        {steps.map((step, i) => (
                            <div key={step.num} className="text-center animate-fade-in-up" style={{ animationDelay: `${i * 200}ms` }}>
                                <div className="mx-auto d-flex align-items-center justify-content-center rounded-4 bg-white shadow-lg border border-secondary mb-4" style={{ width: '4rem', height: '4rem', zIndex: 10 }}>
                                    <span className="text-brand-600">{step.icon}</span>
                                </div>
                                <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-brand-100 text-brand-700 small fw-bold mb-3" style={{ width: '1.75rem', height: '1.75rem' }}>
                                    {step.num}
                                </div>
                                <h3 className="fs-5 fw-semibold text-body">{step.title}</h3>
                                <p className="mt-2 text-secondary lh-lg mx-auto" style={{ maxWidth: '24rem' }}>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section-padding" style={{ background: 'linear-gradient(to bottom right, #111827, #1f2937, var(--bs-brand-950))' }}>
                <div className="container-wide">
                    <div className="row align-items-center g-5 row-cols-lg-2">
                        <div className="animate-fade-in-up">
                            <span className="d-inline-flex align-items-center gap-2 rounded-pill px-4 py-1 small fw-medium text-white border" style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.1) !important', color: 'rgba(255,255,255,0.8)' }}>
                                {__('messages.b2b_badge')}
                            </span>
                            <h2 className="fw-bold text-white text-balance mt-4" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', letterSpacing: '-0.02em' }}>
                                {__('messages.b2b_title')}
                            </h2>
                            <p className="mt-4 lh-lg" style={{ fontSize: '1.125rem', color: '#d1d5db' }}>
                                {__('messages.b2b_subtitle')}
                            </p>
                            <ul className="mt-5 d-flex flex-column gap-3 list-unstyled">
                                {[__('messages.b2b_feature_1'), __('messages.b2b_feature_2'), __('messages.b2b_feature_3'), __('messages.b2b_feature_4')].map((item) => (
                                    <li key={item} className="d-flex align-items-start gap-2">
                                        <svg className="flex-shrink-0 text-brand-400" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ marginTop: '2px' }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span style={{ color: '#d1d5db' }}>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="animate-fade-in-up animation-delay-200">
                            <div className="position-relative">
                                <div className="rounded-5 p-4 p-sm-5 border" style={{ backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(4px)', borderColor: 'rgba(255,255,255,0.1) !important' }}>
                                    <div className="rounded-4 bg-white p-4 shadow-lg">
                                        <div className="mb-3 d-flex align-items-center gap-2">
                                            <div className="d-flex gap-1">
                                                <span className="d-inline-block rounded-circle bg-danger" style={{ width: '0.75rem', height: '0.75rem' }} />
                                                <span className="d-inline-block rounded-circle bg-warning" style={{ width: '0.75rem', height: '0.75rem' }} />
                                                <span className="d-inline-block rounded-circle bg-success" style={{ width: '0.75rem', height: '0.75rem' }} />
                                            </div>
                                            <span className="small text-muted font-monospace">{__('messages.b2b_widget_preview')}</span>
                                        </div>
                                        <div className="d-flex flex-column gap-3">
                                            <div className="d-flex align-items-center justify-content-center rounded-3" style={{ height: '11rem', background: 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)' }}>
                                                <svg className="text-secondary" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                                                </svg>
                                            </div>
                                            <div className="d-flex gap-2 justify-content-center flex-wrap">
                                                {['bg-brand-400 border-brand-200', 'bg-teal-400 border-teal-200', 'bg-rose-400 border-rose-200', 'bg-amber-400 border-amber-200', 'bg-emerald-400 border-emerald-200'].map((c) => (
                                                    <span key={c} className={`d-inline-block rounded-circle border border-2 cursor-pointer transition scale-110-hover ${c}`} style={{ width: '2.25rem', height: '2.25rem' }} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="testimonials" className="section-padding" style={{ backgroundColor: 'rgba(249,250,251,0.5)' }}>
                <div className="container-wide">
                    <div className="text-center mx-auto" style={{ maxWidth: '36rem' }}>
                        <span className="d-inline-flex align-items-center gap-2 rounded-pill bg-brand-50 px-4 py-1 small fw-medium text-brand-700 border border-brand-200 mb-4">{__('messages.testimonials_badge')}</span>
                        <h2 className="fw-bold text-body text-balance" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', letterSpacing: '-0.02em' }}>{__('messages.testimonials_title')}</h2>
                        <p className="mt-3 text-muted" style={{ fontSize: '1.125rem' }}>{__('messages.testimonials_subtitle')}</p>
                    </div>
                    <div className="mt-5 row g-4 row-cols-sm-2 row-cols-lg-3">
                        {testimonials.map((t, i) => (
                            <div key={t.name} className={`card p-4 p-sm-5 animate-fade-in-up ${i === 1 ? 'translate-up-lg-8' : ''}`} style={{ animationDelay: `${i * 150}ms` }}>
                                <div className="d-flex gap-1 mb-4">
                                    {[...Array(5)].map((_, star) => (
                                        <svg key={star} className="text-warning" width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-secondary lh-lg">&ldquo;{t.text}&rdquo;</p>
                                <div className="mt-4 d-flex align-items-center gap-2">
                                    <div className={`d-flex align-items-center justify-content-center rounded-circle small fw-bold text-white ${t.color}`} style={{ width: '2.5rem', height: '2.5rem' }}>
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <p className="small fw-semibold text-body mb-0">{t.name}</p>
                                        <p className="small text-muted">{t.role}, {t.company}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="faq" className="section-padding">
                <div className="container-narrow">
                    <div className="text-center mx-auto" style={{ maxWidth: '36rem' }}>
                        <span className="d-inline-flex align-items-center gap-2 rounded-pill bg-brand-50 px-4 py-1 small fw-medium text-brand-700 border border-brand-200 mb-4">{__('messages.faq_badge')}</span>
                        <h2 className="fw-bold text-body text-balance" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', letterSpacing: '-0.02em' }}>{__('messages.faq_title')}</h2>
                        <p className="mt-3 text-muted" style={{ fontSize: '1.125rem' }}>{__('messages.faq_subtitle')}</p>
                    </div>
                    <div className="mt-5 border rounded-2 overflow-hidden">
                        {faqs.map((faq, i) => (
                            <div key={i} className={`${i !== faqs.length - 1 ? 'border-bottom' : ''}`}>
                                <button
                                    onClick={() => toggleFaq(i)}
                                    className="d-flex align-items-center justify-content-between w-100 px-4 py-4 text-start transition bg-transparent border-0"
                                >
                                    <span className="fw-semibold text-body pe-3">{faq.q}</span>
                                    <svg
                                        className={`flex-shrink-0 text-secondary transition-transform duration-200 ${activeFaq === i ? 'rotate-180 text-brand-500' : ''}`}
                                        width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </button>
                                {activeFaq === i && (
                                    <div className="px-4 pb-4">
                                        <p className="text-secondary lh-lg mb-0">{faq.a}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section-padding position-relative overflow-hidden">
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: -10, background: 'linear-gradient(to bottom right, var(--bs-brand-600), #9333ea, #db2777)' }}>
                    <div className="position-absolute top-0 start-0 w-100 h-100 opacity-50" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')" }} />
                </div>

                <div className="container-wide position-relative">
                    <div className="mx-auto text-center" style={{ maxWidth: '48rem' }}>
                        <h2 className="fw-bold text-white text-balance" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', letterSpacing: '-0.02em' }}>
                            {__('messages.cta_title')}
                        </h2>
                        <p className="mx-auto mt-4 text-brand-100 lh-lg" style={{ maxWidth: '36rem', fontSize: '1.125rem' }}>
                            {__('messages.cta_subtitle')}
                            <span className="d-none d-sm-inline">{__('messages.cta_subtitle_extra')}</span>
                        </p>
                        <div className="mt-5 d-flex flex-column flex-sm-row align-items-center justify-content-center gap-3">
                            {auth.user ? (
                                <div className="d-flex flex-column flex-sm-row gap-3">
                                    {isAdmin && (
                                        <Link href={route('admin.dashboard')} className="d-inline-flex align-items-center justify-content-center gap-2 rounded-4 bg-white px-5 py-3 fw-semibold text-brand-700 shadow-lg transition-all duration-200 hover-bg-brand-50 active-translate-y-0">
                                            {__('messages.nav_dashboard')}
                                        </Link>
                                    )}
                                    <Link href={route('visualize')} className="d-inline-flex align-items-center justify-content-center gap-2 rounded-4 bg-white px-5 py-3 fw-semibold text-brand-700 shadow-lg transition-all duration-200 hover-bg-brand-50 active-translate-y-0">
                                        {__('messages.cta_button')}
                                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                        </svg>
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    {canRegister && (
                                        <Link href={route('register')} className="d-inline-flex align-items-center justify-content-center gap-2 rounded-4 bg-white px-5 py-3 fw-semibold text-brand-700 shadow-lg transition-all duration-200 hover-bg-brand-50 active-translate-y-0">
                                            {__('messages.cta_button_guest')}
                                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                            </svg>
                                        </Link>
                                    )}
                                    {canLogin && (
                                        <Link href={route('login')} className="d-inline-flex align-items-center justify-content-center gap-2 rounded-4 px-5 py-3 fw-semibold text-white transition-all duration-200"
                                            style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}
                                        >
                                            {__('messages.nav_sign_in')}
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <footer style={{ backgroundColor: '#030712', borderTop: '1px solid #1f2937' }}>
                <div className="container-wide px-4 py-5 px-sm-6 px-lg-8">
                    <div className="row g-4 row-cols-sm-2 row-cols-lg-4">
                        <div className="col-lg-6">
                            <Link href="/" className="d-flex align-items-center gap-2 text-decoration-none">
                                <div className="d-flex align-items-center justify-content-center rounded-4 bg-brand-500 shadow-sm" style={{ width: '2.25rem', height: '2.25rem' }}>
                                    <svg className="text-white" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span className="fw-bold text-white">ColorID</span>
                            </Link>
                            <p className="mt-3 small text-white lh-lg" style={{ maxWidth: '24rem' }}>
                                {__('messages.footer_description')}
                            </p>
                        </div>
                        <div>
                            <h3 className="small fw-semibold text-white text-uppercase" style={{ letterSpacing: '0.05em' }}>{__('messages.nav_product')}</h3>
                            <ul className="mt-3 d-flex flex-column gap-2 list-unstyled">
                                <li><a href="#features" className="small text-white text-decoration-none hover-text-gray-300 transition">{__('messages.nav_features')}</a></li>
                                <li><a href="#how-it-works" className="small text-white text-decoration-none hover-text-gray-300 transition">{__('messages.nav_how_it_works')}</a></li>
                                <li><a href="#testimonials" className="small text-white text-decoration-none hover-text-gray-300 transition">{__('messages.nav_testimonials')}</a></li>
                                <li><a href="#faq" className="small text-white text-decoration-none hover-text-gray-300 transition">{__('messages.nav_faq')}</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="small fw-semibold text-white text-uppercase" style={{ letterSpacing: '0.05em' }}>{__('messages.nav_company')}</h3>
                            <ul className="mt-3 d-flex flex-column gap-2 list-unstyled">
                                {canRegister && <li><Link href={route('register')} className="small text-white text-decoration-none hover-text-gray-300 transition">{__('messages.nav_get_started')}</Link></li>}
                                {canLogin && <li><Link href={route('login')} className="small text-white text-decoration-none hover-text-gray-300 transition">{__('messages.nav_sign_in')}</Link></li>}
                            </ul>
                        </div>
                    </div>
                    <div className="mt-5 pt-4 border-top d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3" style={{ borderColor: '#1f2937 !important' }}>
                        <p className="small text-white mb-0">
                            {__('messages.ui_copyright', { year: String(new Date().getFullYear()) })}
                        </p>
                        <div className="d-flex align-items-center gap-4">
                            <a href="#" className="small text-white text-decoration-none hover-text-gray-300 transition">{__('messages.footer_privacy_policy')}</a>
                            <a href="#" className="small text-white text-decoration-none hover-text-gray-300 transition">{__('messages.footer_terms_of_service')}</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
