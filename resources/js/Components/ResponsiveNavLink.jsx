import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({ href, active, children }) {
    const classes = active
        ? 'd-block w-100 ps-3 pe-4 py-2 border-start border-4 border-primary text-start fs-6 fw-medium text-brand-700 bg-brand-50 focus:outline-none focus:text-brand-800 focus:bg-brand-100 focus:border-primary transition duration-150 ease-in-out'
        : 'd-block w-100 ps-3 pe-4 py-2 border-start border-0 text-start fs-6 fw-medium text-secondary hover-text-body hover-bg-light hover-border-secondary focus:outline-none focus:text-body focus:bg-light focus:border-secondary transition duration-150 ease-in-out';

    return (
        <Link href={href} className={classes}>
            {children}
        </Link>
    );
}
