import { Head, useForm, usePage, router } from '@inertiajs/react';
import RootLayout from '@/layouts/RootLayout';
import { useTranslation } from '@/hooks/useTranslation';
import { useState } from 'react';

export default function WebhooksIndex({ webhooks, tenants }) {
    const { __ } = useTranslation();
    const { flash } = usePage().props;
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        tenant_id: '',
        url: '',
        secret: '',
        events: ['submission.completed'],
        is_active: true,
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('admin.webhooks.store'), {
            onSuccess: () => { reset(); setShowForm(false); },
        });
    }

    const availableEvents = ['submission.completed', 'submission.failed'];

    function toggleEvent(event) {
        const updated = data.events.includes(event)
            ? data.events.filter(e => e !== event)
            : [...data.events, event];
        setData('events', updated);
    }

    return (
        <>
            <Head title={__('messages.admin_webhooks')} />

            <RootLayout>
                <div className="container-fluid">
                    <div className="d-sm-flex align-items-center justify-content-between mb-4">
                        <h1 className="h3 mb-0 text-gray-800">{__('messages.admin_webhooks')}</h1>
                        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary btn-sm">
                            {showForm ? __('messages.cancel') : __('messages.admin_add_webhook')}
                        </button>
                    </div>

                    {flash?.success && <div className="alert alert-success">{flash.success}</div>}

                    {showForm && (
                        <div className="card shadow mb-4">
                            <div className="card-header py-3">
                                <h6 className="m-0 font-weight-bold text-primary">{__('messages.admin_add_webhook')}</h6>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label className="form-label">{__('messages.admin_tenant')}</label>
                                            <select className={`form-control ${errors.tenant_id ? 'is-invalid' : ''}`}
                                                value={data.tenant_id} onChange={e => setData('tenant_id', e.target.value)}>
                                                <option value="">{__('messages.admin_select_tenant')}</option>
                                                {tenants?.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label className="form-label">{__('messages.webhook_url')}</label>
                                            <input type="url" className={`form-control ${errors.url ? 'is-invalid' : ''}`}
                                                value={data.url} onChange={e => setData('url', e.target.value)}
                                                placeholder="https://example.com/webhook" />
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label className="form-label">{__('messages.webhook_secret')}</label>
                                            <input type="text" className="form-control"
                                                value={data.secret} onChange={e => setData('secret', e.target.value)} />
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label className="form-label d-block">{__('messages.webhook_events')}</label>
                                            {availableEvents.map(event => (
                                                <div key={event} className="custom-control custom-checkbox custom-control-inline">
                                                    <input type="checkbox" className="custom-control-input"
                                                        id={`event-${event}`}
                                                        checked={data.events.includes(event)}
                                                        onChange={() => toggleEvent(event)} />
                                                    <label className="custom-control-label" htmlFor={`event-${event}`}>{event}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-primary" disabled={processing}>
                                        {__('messages.admin_save')}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary">{__('messages.admin_webhooks')}</h6>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-bordered table-hover table-sm">
                                    <thead>
                                        <tr>
                                            <th>{__('messages.admin_tenant')}</th>
                                            <th>{__('messages.webhook_url')}</th>
                                            <th>{__('messages.webhook_events')}</th>
                                            <th>{__('messages.admin_status')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {webhooks?.data?.length === 0 ? (
                                            <tr><td colSpan={4} className="text-center text-muted">{__('messages.admin_no_webhooks')}</td></tr>
                                        ) : (
                                            webhooks?.data?.map(w => (
                                                <tr key={w.id}>
                                                    <td className="small">{w.tenant_name}</td>
                                                    <td className="small text-secondary">{w.url}</td>
                                                    <td>{w.events?.map(e => <span key={e} className="badge badge-primary me-1">{e}</span>)}</td>
                                                    <td><span className={`badge ${w.is_active ? 'badge-success' : 'badge-secondary'}`}>{w.is_active ? __('messages.active') : __('messages.inactive')}</span></td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {webhooks?.links && (
                                <nav className="mt-3">
                                    <ul className="pagination pagination-sm justify-content-center mb-0">
                                        {webhooks.links.map((link, index) => (
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
