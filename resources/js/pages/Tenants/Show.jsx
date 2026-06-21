import { Head, Link } from '@inertiajs/react';
import { useMemo } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

const statusBadge = {
    pending: 'bg-warning bg-opacity-25 text-warning',
    processing: 'bg-info bg-opacity-25 text-info',
    completed: 'bg-success bg-opacity-25 text-success',
    failed: 'bg-danger bg-opacity-25 text-danger',
};

export default function TenantShow({ tenant, submissions }) {
    const { __ } = useTranslation();

    const settingsList = useMemo(() => {
        if (!tenant.settings) return [];
        return tenant.settings.map((s) => ({ key: s.key, value: s.value }));
    }, [tenant.settings]);

    return (
        <>
            <Head title={__('messages.admin_tenant_for', { name: tenant.name })} />

            <div className="mx-auto" style={{ maxWidth: '80rem' }}>
                <nav className="mb-4">
                    <Link href="/admin/tenants" className="small text-primary text-decoration-none">
                        &larr; {__('messages.admin_back_to_tenants')}
                    </Link>
                </nav>

                <h1 className="fs-3 fw-semibold text-body mb-4">{tenant.name}</h1>

                <div className="row g-4 mb-5">
                    <div className="col-lg-8 bg-white rounded-4 border border-secondary shadow-sm p-4">
                        <h2 className="fs-5 fw-semibold text-body mb-3">{__('messages.admin_tenant_information')}</h2>
                        <dl className="row g-3 mb-0">
                            <div className="col-sm-6">
                                <dt className="small fw-medium text-secondary text-uppercase mb-0">{__('messages.admin_name')}</dt>
                                <dd className="small text-body mt-1 mb-0">{tenant.name}</dd>
                            </div>
                            <div className="col-sm-6">
                                <dt className="small fw-medium text-secondary text-uppercase mb-0">{__('messages.admin_domain')}</dt>
                                <dd className="small text-body mt-1 mb-0">{tenant.domain}</dd>
                            </div>
                            <div className="col-sm-6">
                                <dt className="small fw-medium text-secondary text-uppercase mb-0">{__('messages.admin_status')}</dt>
                                <dd className="mt-1 mb-0">
                                    <span className={`d-inline-flex align-items-center px-2 py-1 rounded-pill small fw-medium ${tenant.status ? 'bg-success bg-opacity-25 text-success' : 'bg-danger bg-opacity-25 text-danger'}`}>
                                        {tenant.status ? __('messages.admin_status_active') : __('messages.admin_status_inactive')}
                                    </span>
                                </dd>
                            </div>
                            <div className="col-sm-6">
                                <dt className="small fw-medium text-secondary text-uppercase mb-0">{__('messages.admin_monthly_limit')}</dt>
                                <dd className="small text-body mt-1 mb-0">{tenant.monthly_limit}</dd>
                            </div>
                        </dl>

                        <div className="mt-4">
                            <h3 className="small fw-medium text-secondary mb-2">{__('messages.admin_brand_colors')}</h3>
                            <div className="d-flex gap-3">
                                {tenant.primary_color && (
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="rounded-3 border border-secondary" style={{ width: '2rem', height: '2rem', backgroundColor: tenant.primary_color }} />
                                        <span className="small text-secondary">{tenant.primary_color}</span>
                                    </div>
                                )}
                                {tenant.secondary_color && (
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="rounded-3 border border-secondary" style={{ width: '2rem', height: '2rem', backgroundColor: tenant.secondary_color }} />
                                        <span className="small text-secondary">{tenant.secondary_color}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {tenant.logo && (
                            <div className="mt-4">
                                <h3 className="small fw-medium text-secondary mb-2">{__('messages.admin_logo')}</h3>
                                <img src={`/storage/${tenant.logo}`} alt={`${tenant.name} ${__('messages.admin_logo')}`} className="w-auto" style={{ height: '4rem', objectFit: 'contain' }} />
                            </div>
                        )}
                    </div>

                    <div className="col-lg-4 bg-white rounded-4 border border-secondary shadow-sm p-4">
                        <h2 className="fs-5 fw-semibold text-body mb-3">{__('messages.admin_settings')}</h2>
                        {settingsList.length === 0 ? (
                            <p className="small text-secondary mb-0">{__('messages.admin_no_settings')}</p>
                        ) : (
                            <dl className="d-flex flex-column gap-2 mb-0">
                                {settingsList.map((setting) => (
                                    <div key={setting.key}>
                                        <dt className="small fw-medium text-secondary text-uppercase mb-0">{setting.key.replace(/_/g, ' ')}</dt>
                                        <dd className="small text-body text-break mt-0 mb-0">{setting.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-4 border border-secondary shadow-sm">
                    <div className="px-4 py-3 border-bottom border-secondary">
                        <h2 className="fs-5 fw-semibold text-body mb-0">{__('messages.admin_submissions')}</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="px-4 py-3 text-start small fw-medium text-secondary text-uppercase">{__('messages.admin_uuid')}</th>
                                    <th className="px-4 py-3 text-start small fw-medium text-secondary text-uppercase">{__('messages.admin_name')}</th>
                                    <th className="px-4 py-3 text-start small fw-medium text-secondary text-uppercase">{__('messages.admin_email')}</th>
                                    <th className="px-4 py-3 text-start small fw-medium text-secondary text-uppercase">{__('messages.admin_status')}</th>
                                    <th className="px-4 py-3 text-start small fw-medium text-secondary text-uppercase">{__('messages.admin_date')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-5 text-center text-secondary">
                                            {__('messages.admin_no_submissions_for_tenant')}
                                        </td>
                                    </tr>
                                ) : (
                                    submissions.data.map((sub) => (
                                        <tr key={sub.uuid} className="transition">
                                            <td className="px-4 py-3 text-nowrap small text-secondary font-monospace">{sub.uuid.substring(0, 8)}...</td>
                                            <td className="px-4 py-3 text-nowrap small fw-medium text-body">{sub.name}</td>
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
                </div>
            </div>
        </>
    );
}
