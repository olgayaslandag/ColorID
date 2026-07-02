import { useEffect } from 'react';
import LanguageSwitcher from '@/Components/LanguageSwitcher';

// Import SB Admin 2 CSS for auth pages
import '../../css/admin.css';

export default function GuestLayout({
    children,
    imageClass = 'bg-login-image',
    imageColClass = 'col-lg-6',
    contentColClass = 'col-lg-6',
}) {
    useEffect(() => {
        document.body.classList.add('bg-gradient-primary');
        return () => {
            document.body.classList.remove('bg-gradient-primary');
        };
    }, []);

    return (
        <>
            <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
                <LanguageSwitcher />
            </div>

            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-10 col-lg-12 col-md-9">
                        <div className="card o-hidden border-0 shadow-lg my-5">
                            <div className="card-body p-0">
                                <div className="row">
                                    <div className={`${imageColClass} d-none d-lg-block ${imageClass}`}></div>
                                    <div className={contentColClass}>
                                        <div className="p-5">
                                            {children}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
