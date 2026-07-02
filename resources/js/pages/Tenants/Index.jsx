import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import RootLayout from '@/layouts/RootLayout';
import { useTranslation } from '@/hooks/useTranslation';

export default function TenantsIndex({ tenants }) {
    const { __ } = useTranslation();
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        domain: '',
        monthly_limit: '100',
        primary_color: '#4F46E5',
        secondary_color: '#7C3AED',
    });

    const toggleStatus = (tenant) => {
        const msg = tenant.status
            ? __('messages.admin_confirm_deactivate', { name: tenant.name })
            : __('messages.admin_confirm_activate', { name: tenant.name });
        if (confirm(msg)) {
            router.put(route('admin.tenants.update', tenant.id), {
                status: !tenant.status,
            });
        }
    };

    const handleCreate = (e) => {
        e.preventDefault();
        post(route('admin.tenants.store'), {
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };

    return (
        <RootLayout>
            <Head title={__('messages.admin_tenants')} />

            <div className="container-fluid">
                {/* Page Heading */}
                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">{__('messages.admin_tenants')}</h1>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
                        {showForm ? __('messages.button_cancel') : '+ ' + __('messages.admin_add_tenant')}
                    </button>
                </div>

                {/* Create Form */}
                {showForm && (
                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary">{__('messages.admin_add_tenant')}</h6>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleCreate}>
                                <div className="form-row">
                                    <div className="col-md-4 mb-3">
                                        <label className="small font-weight-bold">{__('messages.admin_name')}</label>
                                        <input type="text" className={`form-control form-control-sm ${errors.name ? 'is-invalid' : ''}`}
                                               value={data.name} onChange={(e) => setData('name', e.target.value)}
                                               placeholder="e.g. My Company" />
                                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="small font-weight-bold">{__('messages.admin_domain')}</label>
                                        <input type="text" className={`form-control form-control-sm ${errors.domain ? 'is-invalid' : ''}`}
                                               value={data.domain} onChange={(e) => setData('domain', e.target.value)}
                                               placeholder="e.g. mycompany.example.com" />
                                        {errors.domain && <div className="invalid-feedback">{errors.domain}</div>}
                                    </div>
                                    <div className="col-md-2 mb-3">
                                        <label className="small font-weight-bold">{__('messages.admin_monthly_limit')}</label>
                                        <input type="number" className={`form-control form-control-sm ${errors.monthly_limit ? 'is-invalid' : ''}`}
                                               value={data.monthly_limit} onChange={(e) => setData('monthly_limit', e.target.value)} />
                                        {errors.monthly_limit && <div className="invalid-feedback">{errors.monthly_limit}</div>}
                                    </div>
                                    <div className="col-md-2 d-flex align-items-end mb-3">
                                        <button type="submit" className="btn btn-primary btn-sm btn-block" disabled={processing}>
                                            {processing ? __('messages.ui_processing') : __('messages.admin_create')}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Tenants Table Card */}
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">{__('messages.admin_tenants')}</h6>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered table-sm">
                                <thead>
                                    <tr>
                                        <th>{__('messages.admin_name')}</th>
                                        <th>{__('messages.admin_domain')}</th>
                                        <th>{__('messages.admin_status')}</th>
                                        <th>{__('messages.admin_monthly_limit')}</th>
                                        <th>{__('messages.admin_actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tenants.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center py-4">
                                                {__('messages.admin_no_tenants')}
                                            </td>
                                        </tr>
                                    ) : (
                                        tenants.data.map((tenant) => (
                                            <tr key={tenant.id}>
                                                <td>
                                                    <Link href={route('admin.tenants.show', tenant.id)} className="font-weight-bold text-primary">
                                                        {tenant.name}
                                                    </Link>
                                                </td>
                                                <td>{tenant.domain}</td>
                                                <td>
                                                    <span className={`badge ${tenant.status ? 'badge-success' : 'badge-danger'}`}>
                                                        {tenant.status ? __('messages.admin_status_active') : __('messages.admin_status_inactive')}
                                                    </span>
                                                </td>
                                                <td>{tenant.monthly_limit}</td>
                                                <td className="text-nowrap">
                                                    <Link href={route('admin.tenants.show', tenant.id)} className="btn btn-primary btn-sm mr-2">
                                                        {__('messages.admin_edit')}
                                                    </Link>
                                                    <button
                                                        onClick={() => toggleStatus(tenant)}
                                                        className={`btn btn-sm ${tenant.status ? 'btn-danger' : 'btn-success'}`}
                                                    >
                                                        {tenant.status ? __('messages.admin_status_deactivate') : __('messages.admin_status_activate')}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {tenants.last_page > 1 && (
                            <div className="d-flex align-items-center justify-content-between mt-3">
                                <p className="small text-secondary mb-0">
                                    {__('messages.admin_showing_results', { from: String(tenants.from ?? ''), to: String(tenants.to ?? ''), total: String(tenants.total) })}
                                </p>
                                <div className="d-flex gap-2">
                                    {tenants.links.map((link, i) => (
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
