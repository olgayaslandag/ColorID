import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import RootLayout from '@/layouts/RootLayout';
import { useTranslation } from '@/hooks/useTranslation';

export default function ActivityLogIndex({ activities, subjectTypes = [], events = [], filters = {} }) {
    const { __ } = useTranslation();

    const [search, setSearch] = useState(filters.search ?? '');
    const [subjectType, setSubjectType] = useState(filters.subject_type ?? '');
    const [event, setEvent] = useState(filters.event ?? '');

    function applyFilters() {
        const params = {};
        if (search.trim()) params.search = search.trim();
        if (subjectType) params.subject_type = subjectType;
        if (event) params.event = event;
        router.get(route('admin.activity-log'), params, {
            preserveState: false,
            preserveScroll: true,
        });
    }

    function clearFilters() {
        setSearch('');
        setSubjectType('');
        setEvent('');
        router.get(route('admin.activity-log'), {}, {
            preserveState: false,
            preserveScroll: true,
        });
    }

    const hasActiveFilters = search.trim() || subjectType || event;

    return (
        <>
            <Head title={__('messages.admin_activity_log')} />

            <RootLayout>
                <div className="container-fluid">
                    <div className="d-sm-flex align-items-center justify-content-between mb-4">
                        <h1 className="h3 mb-0 text-gray-800">{__('messages.admin_activity_log')}</h1>
                    </div>

                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <div className="row g-2 align-items-end">
                                <div className="col-md-4">
                                    <label className="small fw-bold text-primary">{__('messages.admin_search_placeholder')}</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder={__('messages.admin_search_placeholder')}
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="small fw-bold text-primary">{__('messages.admin_subject')}</label>
                                    <select className="form-select form-select-sm" value={subjectType} onChange={(e) => setSubjectType(e.target.value)}>
                                        <option value="">--</option>
                                        {subjectTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label className="small fw-bold text-primary">{__('messages.admin_action')}</label>
                                    <select className="form-select form-select-sm" value={event} onChange={(e) => setEvent(e.target.value)}>
                                        <option value="">--</option>
                                        {events.map((e) => <option key={e} value={e}>{e}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-2 d-flex gap-1">
                                    <button className="btn btn-primary btn-sm flex-grow-1" onClick={applyFilters}>
                                        <i className="fas fa-search me-1"></i>
                                        {__('messages.button_search')}
                                    </button>
                                    {hasActiveFilters && (
                                        <button className="btn btn-outline-secondary btn-sm" onClick={clearFilters}>
                                            <i className="fas fa-times"></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-bordered table-hover table-sm">
                                    <thead>
                                        <tr>
                                            <th>{__('messages.admin_date')}</th>
                                            <th>{__('messages.admin_user')}</th>
                                            <th>{__('messages.admin_action')}</th>
                                            <th>{__('messages.admin_subject')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activities?.data?.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="text-center text-muted">
                                                    {hasActiveFilters ? __('messages.ui_no_results') : __('messages.admin_no_activities')}
                                                </td>
                                            </tr>
                                        ) : (
                                            activities?.data?.map((activity) => (
                                                <tr key={activity.id}>
                                                    <td className="text-nowrap small text-secondary">
                                                        {new Date(activity.created_at).toLocaleString()}
                                                    </td>
                                                    <td className="text-nowrap small">
                                                        {activity.causer ? activity.causer.name : __('messages.admin_system')}
                                                    </td>
                                                    <td className="text-nowrap small fw-medium">
                                                        <span className="badge badge-info">{activity.event || activity.description}</span>
                                                    </td>
                                                    <td className="text-nowrap small text-secondary">
                                                        {activity.subject_type} #{activity.subject_id}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {activities?.links && (
                                <nav className="mt-3">
                                    <ul className="pagination pagination-sm justify-content-center mb-0">
                                        {activities.links.map((link, index) => (
                                            <li
                                                key={index}
                                                className={`page-item ${link.active ? 'active' : ''} ${link.url === null ? 'disabled' : ''}`}
                                            >
                                                <Link
                                                    href={link.url || '#'}
                                                    className="page-link"
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                    preserveScroll
                                                    preserveState
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            )}
                        </div>
                    </div>
                </div>
            </RootLayout>
        </>
    );
}
