import { Head, Link, router } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

const statusBadge = {
    pending: 'bg-warning bg-opacity-25 text-warning',
    processing: 'bg-info bg-opacity-25 text-info',
    completed: 'bg-success bg-opacity-25 text-success',
    failed: 'bg-danger bg-opacity-25 text-danger',
};

export default function SubmissionsIndex({ submissions, filters }) {
    const { __ } = useTranslation();

    const statusOptions = [
        { value: '', label: __('messages.admin_all_statuses') },
        { value: 'pending', label: __('messages.admin_status_pending') },
        { value: 'processing', label: __('messages.admin_status_processing') },
        { value: 'completed', label: __('messages.admin_status_completed') },
        { value: 'failed', label: __('messages.admin_status_failed') },
    ];

    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    const applyFilters = useCallback(() => {
        router.get('/admin/submissions', {
            search: search || null,
            status: status || null,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }, [search, status]);

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            applyFilters();
        }
    };

    const clearFilters = () => {
        setSearch('');
        setStatus('');
        router.get('/admin/submissions', {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <>
            <Head title={__('messages.admin_submissions')} />

            <div className="mx-auto" style={{ maxWidth: '80rem' }}>
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <h1 className="fs-3 fw-semibold text-body mb-0">{__('messages.admin_submissions')}</h1>
                </div>

                <div className="bg-white rounded-4 border border-secondary shadow-sm p-3 mb-4">
                    <div className="d-flex flex-wrap align-items-center gap-3">
                        <div className="flex-grow-1" style={{ minWidth: '200px' }}>
                            <label htmlFor="search" className="visually-hidden">{__('messages.button_search')}</label>
                            <input
                                id="search"
                                type="text"
                                placeholder={__('messages.admin_search_placeholder')}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                className="form-control form-control-sm rounded-3"
                            />
                        </div>
                        <div style={{ width: '12rem' }}>
                            <label htmlFor="status" className="visually-hidden">{__('messages.admin_status')}</label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="form-select form-select-sm rounded-3"
                            >
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                        <button onClick={applyFilters} className="px-4 py-2 bg-primary text-white small fw-medium rounded-3 border-0 transition">
                            {__('messages.button_filter')}
                        </button>
                        {(search || status) && (
                            <button onClick={clearFilters} className="px-4 py-2 small fw-medium text-secondary btn btn-link text-decoration-none transition">
                                {__('messages.button_clear')}
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-4 border border-secondary shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="px-4 py-3 text-start small fw-medium text-secondary text-uppercase">{__('messages.admin_uuid')}</th>
                                    <th className="px-4 py-3 text-start small fw-medium text-secondary text-uppercase">{__('messages.admin_name')}</th>
                                    <th className="px-4 py-3 text-start small fw-medium text-secondary text-uppercase">{__('messages.admin_phone')}</th>
                                    <th className="px-4 py-3 text-start small fw-medium text-secondary text-uppercase">{__('messages.admin_email')}</th>
                                    <th className="px-4 py-3 text-start small fw-medium text-secondary text-uppercase">{__('messages.admin_status')}</th>
                                    <th className="px-4 py-3 text-start small fw-medium text-secondary text-uppercase">{__('messages.admin_date')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-5 text-center text-secondary">
                                            {__('messages.admin_no_submissions')}
                                        </td>
                                    </tr>
                                ) : (
                                    submissions.data.map((sub) => (
                                        <tr key={sub.uuid} className="transition">
                                            <td className="px-4 py-3 text-nowrap small text-secondary font-monospace">
                                                <Link href={`/admin/submissions/${sub.uuid}`} className="text-primary text-decoration-none">
                                                    {sub.uuid.substring(0, 8)}...
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3 text-nowrap small fw-medium text-body">{sub.name}</td>
                                            <td className="px-4 py-3 text-nowrap small text-secondary">{sub.phone}</td>
                                            <td className="px-4 py-3 text-nowrap small text-secondary">{sub.email}</td>
                                            <td className="px-4 py-3 text-nowrap">
                                                <span className={`d-inline-flex align-items-center px-2 py-1 rounded-pill small fw-medium ${statusBadge[sub.status] || 'bg-light text-secondary'}`}>
                                                    {sub.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-nowrap small text-secondary">{new Date(sub.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {submissions.last_page > 1 && (
                        <div className="px-4 py-3 border-top border-secondary d-flex align-items-center justify-content-between">
                            <p className="small text-secondary mb-0">
                                {__('messages.admin_showing_results', { from: String(submissions.from ?? ''), to: String(submissions.to ?? ''), total: String(submissions.total) })}
                            </p>
                            <div className="d-flex gap-2">
                                {submissions.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        disabled={!link.url}
                                        className={`px-3 py-1 small rounded-2 border transition ${
                                            link.active
                                                ? 'bg-primary text-white border-primary'
                                                : link.url
                                                    ? 'bg-white text-secondary border-secondary'
                                                    : 'bg-light text-secondary border-secondary'
                                        }`}
                                        preserveState
                                        preserveScroll
                                    >
                                        {link.label.includes('Previous') ? '‹' : link.label.includes('Next') ? '›' : link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
