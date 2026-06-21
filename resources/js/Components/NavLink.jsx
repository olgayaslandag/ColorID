import { Link } from '@inertiajs/react';

export default function NavLink({ href, active, children }) {
    const classes = active
        ? 'd-inline-flex align-items-center px-1 pt-1 border-bottom border-2 border-primary small fw-medium lh-sm text-body focus:outline-none focus:border-primary transition'
        : 'd-inline-flex align-items-center px-1 pt-1 border-bottom border-0 small fw-medium lh-sm text-secondary hover-text-body hover-border-secondary focus:outline-none focus:text-body focus:border-secondary transition';

    return (
        <Link href={href} className={classes}>
            {children}
        </Link>
    );
}
