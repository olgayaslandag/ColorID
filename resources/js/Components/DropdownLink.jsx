import React from 'react';
import { Link } from '@inertiajs/react';

export default function DropdownLink({ href, children }) {
    return (
        <Link
            href={href}
            className="d-block w-100 px-4 py-2 text-start small lh-sm text-secondary transition hover-bg-light focus:bg-light focus:outline-none"
        >
            {children}
        </Link>
    );
}
