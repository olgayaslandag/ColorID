import { Head, Link, router } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import RootLayout from '@/layouts/RootLayout';
import { useTranslation } from '@/hooks/useTranslation';

const statusBadge = {
    pending: 'badge badge-warning',
    processing: 'badge badge-info',
    completed: 'badge badge-success',
    failed: 'badge badge-danger',
};

export default function SubmissionsIndex({ submissions, tenants = [], filters = {} }) {
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
    const [tenantId, setTenantId] = useState(filters.tenant_id ?? '');
    const [city, setCity] = useState(filters.city ?? '');
    const [selected, setSelected] = useState([]);

    const allIds = (submissions.data || []).map((s) => s.uuid);
    const allSelected = selected.length > 0 && selected.length === allIds.length;

    const toggleSelectAll = () => {
        if (allSelected) {
            setSelected([]);
        } else {
            setSelected(allIds);
        }
    };

    const toggleSelect = (uuid) => {
        setSelected((prev) =>
            prev.includes(uuid) ? prev.filter((id) => id !== uuid) : [...prev, uuid]
        );
    };

    const deleteSelected = () => {
        if (selected.length === 0) return;
        if (!confirm(__('messages.ui_confirm'))) return;
        router.post(route('admin.submissions.batch-delete'), { ids: selected }, {
            onSuccess: () => setSelected([]),
        });
    };

    const deleteSubmission = (uuid) => {
        if (!confirm(__('messages.admin_confirm_delete_submission'))) return;
        router.delete(route('admin.submissions.destroy', uuid));
    };

    const applyFilters = useCallback(() => {
        const params = {};
        if (search) params.search = search;
        if (status) params.status = status;
        if (tenantId) params.tenant_id = tenantId;
        if (city) params.city = city;
        router.get(route('admin.submissions.index'), params, {
            preserveState: false,
            preserveScroll: true,
            replace: true,
        });
    }, [search, status, tenantId, city]);

    const clearFilters = () => {
        setSearch('');
        setStatus('');
        setTenantId('');
        setCity('');
        setSelected([]);
        router.get(route('admin.submissions.index'), {}, {
            preserveState: false,
            preserveScroll: true,
            replace: true,
        });
    };

    const exportSubmissions = () => {
        window.location.href = route('admin.submissions.export');
    };

    const hasActiveFilters = search || status || tenantId || city;

    return (
        <RootLayout>
            <Head title={__('messages.admin_submissions')} />

            <div className="container-fluid">
                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">{__('messages.admin_submissions')}</h1>
                    <div className="d-flex gap-2">
                        {selected.length > 0 && (
                            <button onClick={deleteSelected} className="btn btn-danger btn-sm">
                                {__('messages.admin_delete_selected')} ({selected.length})
                            </button>
                        )}
                        <button onClick={exportSubmissions} className="btn btn-outline-secondary btn-sm">
                            {__('messages.admin_export')}
                        </button>
                    </div>
                </div>

                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <div className="row g-2 align-items-end">
                            <div className="col-md-3">
                                <label className="small fw-bold text-primary">{__('messages.admin_search_placeholder')}</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder={__('messages.admin_search_placeholder')}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="col-md-2">
                                <label className="small fw-bold text-primary">{__('messages.admin_status')}</label>
                                <select className="form-select form-select-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
                                    {statusOptions.map((option) => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-2">
                                <label className="small fw-bold text-primary">{__('messages.hesap_name')}</label>
                                <select className="form-select form-select-sm" value={tenantId} onChange={(e) => setTenantId(e.target.value)}>
                                    <option value="">--</option>
                                    {tenants.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>
                            <div className="col-md-2">
                                <label className="small fw-bold text-primary">{__('messages.admin_city')}</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder={__('messages.admin_city')}
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </div>
                            <div className="col-md-3 d-flex gap-1">
                                <button onClick={applyFilters} className="btn btn-primary btn-sm flex-grow-1">
                                    <i className="fas fa-search me-1"></i>
                                    {__('messages.button_search')}
                                </button>
                                {hasActiveFilters && (
                                    <button onClick={clearFilters} className="btn btn-outline-secondary btn-sm">
                                        <i className="fas fa-times"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered table-sm">
                                <thead>
                                    <tr>
                                        <th style={{ width: '3rem' }}>
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    checked={allSelected}
                                                    onChange={toggleSelectAll}
                                                    id="selectAll"
                                                />
                                                <label className="form-check-label" htmlFor="selectAll">
                                                    <span className="sr-only">{__('messages.admin_select_all')}</span>
                                                </label>
                                            </div>
                                        </th>
                                        <th>{__('messages.admin_uuid')}</th>
                                        <th>{__('messages.admin_name')}</th>
                                        <th>{__('messages.admin_phone')}</th>
                                        <th>{__('messages.admin_email')}</th>
                                        <th>{__('messages.admin_status')}</th>
                                        <th>{__('messages.admin_date')}</th>
                                        <th>{__('messages.admin_actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="text-center py-4">
                                                {hasActiveFilters ? __('messages.ui_no_results') : __('messages.admin_no_submissions')}
                                            </td>
                                        </tr>
                                    ) : (
                                        submissions.data.map((sub) => (
                                            <tr key={sub.uuid}>
                                                <td>
                                                    <div className="form-check">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            checked={selected.includes(sub.uuid)}
                                                            onChange={() => toggleSelect(sub.uuid)}
                                                            id={`select-${sub.uuid}`}
                                                        />
                                                        <label className="form-check-label" htmlFor={`select-${sub.uuid}`}>
                                                            <span className="sr-only">Select</span>
                                                        </label>
                                                    </div>
                                                </td>
                                                <td className="font-monospace">
                                                    <Link href={route('admin.submissions.show', sub.uuid)} className="text-primary">
                                                        {sub.uuid.substring(0, 8)}...
                                                    </Link>
                                                </td>
                                                <td className="font-weight-bold">{sub.name}</td>
                                                <td>{sub.phone}</td>
                                                <td>{sub.email}</td>
                                                <td>
                                                    <span className={statusBadge[sub.status] || 'badge badge-secondary'}>
                                                        {sub.status}
                                                    </span>
                                                </td>
                                                <td>{new Date(sub.created_at).toLocaleDateString()}</td>
                                                <td>
                                                    <button
                                                        onClick={() => deleteSubmission(sub.uuid)}
                                                        className="btn btn-danger btn-sm"
                                                        title={__('messages.admin_delete')}
                                                    >
                                                        {__('messages.admin_delete')}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {submissions.last_page > 1 && (
                            <div className="d-flex align-items-center justify-content-between mt-3">
                                <p className="small text-secondary mb-0">
                                    {__('messages.admin_showing_results', { from: String(submissions.from ?? ''), to: String(submissions.to ?? ''), total: String(submissions.total) })}
                                </p>
                                <div className="d-flex gap-2">
                                    {submissions.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            disabled={!link.url}
                                            className={`btn btn-sm ${link.active ? 'btn-primary' : link.url ? 'btn-outline-secondary' : 'btn-light disabled'}`}
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
            </div>
        </RootLayout>
    );
}
