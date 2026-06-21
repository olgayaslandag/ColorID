import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';

export default function TenantsIndex({ tenants }) {
    const { __ } = useTranslation();

    const toggleStatus = (tenant) => {
        const msg = tenant.status
            ? __('messages.admin_confirm_deactivate', { name: tenant.name })
            : __('messages.admin_confirm_activate', { name: tenant.name });
        if (confirm(msg)) {
            router.put(`/admin/tenants/${tenant.id}`, {
                status: !tenant.status,
            });
        }
    };

    return (
        <>
            <Head title={__('messages.admin_tenants')} />

            <div className="mx-auto" style={{ maxWidth: '80rem' }}>
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <h1 className="fs-3 fw-semibold text-body mb-0">{__('messages.admin_tenants')}</h1>
                </div>

                <div className="bg-white rounded-4 border border-secondary shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="px-4 py-3 text-start small fw-medium text-secondary text-uppercase">{__('messages.admin_name')}</th>
                                    <th className="px-4 py-3 text-start small fw-medium text-secondary text-uppercase">{__('messages.admin_domain')}</th>
                                    <th className="px-4 py-3 text-start small fw-medium text-secondary text-uppercase">{__('messages.admin_status')}</th>
                                    <th className="px-4 py-3 text-start small fw-medium text-secondary text-uppercase">{__('messages.admin_monthly_limit')}</th>
                                    <th className="px-4 py-3 text-end small fw-medium text-secondary text-uppercase">{__('messages.admin_actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tenants.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-5 text-center text-secondary">
                                            {__('messages.admin_no_tenants')}
                                        </td>
                                    </tr>
                                ) : (
                                    tenants.data.map((tenant) => (
                                        <tr key={tenant.id} className="transition">
                                            <td className="px-4 py-3 text-nowrap">
                                                <Link href={`/admin/tenants/${tenant.id}`} className="small fw-medium text-primary text-decoration-none">{tenant.name}</Link>
                                            </td>
                                            <td className="px-4 py-3 text-nowrap small text-secondary">{tenant.domain}</td>
                                            <td className="px-4 py-3 text-nowrap">
                                                <span className={`d-inline-flex align-items-center px-2 py-1 rounded-pill small fw-medium ${tenant.status ? 'bg-success bg-opacity-25 text-success' : 'bg-danger bg-opacity-25 text-danger'}`}>
                                                    {tenant.status ? __('messages.admin_status_active') : __('messages.admin_status_inactive')}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-nowrap small text-secondary">{tenant.monthly_limit}</td>
                                            <td className="px-4 py-3 text-nowrap text-end small fw-medium">
                                                <Link href={`/admin/tenants/${tenant.id}`} className="text-primary text-decoration-none me-3">
                                                    {__('messages.admin_edit')}
                                                </Link>
                                                <button onClick={() => toggleStatus(tenant)} className={`btn btn-sm border-0 p-0 small fw-medium ${tenant.status ? 'text-danger' : 'text-success'}`}>
                                                    {tenant.status ? __('messages.admin_status_deactivate') : __('messages.admin_status_activate')}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {tenants.last_page > 1 && (
                        <div className="px-4 py-3 border-top border-secondary d-flex align-items-center justify-content-between">
                            <p className="small text-secondary mb-0">
                                {__('messages.admin_showing_results', { from: String(tenants.from ?? ''), to: String(tenants.to ?? ''), total: String(tenants.total) })}
                            </p>
                            <div className="d-flex gap-2">
                                {tenants.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        disabled={!link.url}
                                        className={`px-3 py-1 small rounded-2 border transition ${link.active ? 'bg-primary text-white border-primary' : link.url ? 'bg-white text-secondary border-secondary' : 'bg-light text-secondary border-secondary'}`}
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
