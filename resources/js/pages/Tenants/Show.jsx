import { Head, Link } from '@inertiajs/react';
import { useMemo } from 'react';
import RootLayout from '@/layouts/RootLayout';
import { useTranslation } from '@/hooks/useTranslation';

const statusBadge = {
    pending: 'badge badge-warning',
    processing: 'badge badge-info',
    completed: 'badge badge-success',
    failed: 'badge badge-danger',
};

export default function TenantShow({ tenant, submissions }) {
    const { __ } = useTranslation();

    const settingsList = useMemo(() => {
        if (!tenant.settings) return [];
        return tenant.settings.map((s) => ({ key: s.key, value: s.value }));
    }, [tenant.settings]);

    return (
        <RootLayout>
            <Head title={__('messages.admin_tenant_for', { name: tenant.name })} />

            <div className="container-fluid">
                {/* Page Heading */}
                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">{tenant.name}</h1>
                    <Link href={route('admin.tenants.api-key', tenant.id)} className="btn btn-primary btn-sm">
                        {__('messages.admin_api_key')}
                    </Link>
                </div>

                {/* Back link */}
                <Link href={route('admin.tenants.index')} className="btn btn-outline-secondary btn-sm mb-4">
                    &larr; {__('messages.admin_back_to_tenants')}
                </Link>

                <div className="row">
                    {/* Tenant Information Card */}
                    <div className="col-lg-8 mb-4">
                        <div className="card shadow mb-4">
                            <div className="card-header py-3">
                                <h6 className="m-0 font-weight-bold text-primary">{__('messages.admin_tenant_information')}</h6>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-6 mb-3">
                                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">{__('messages.admin_name')}</div>
                                        <p className="mb-0 font-weight-bold text-gray-800">{tenant.name}</p>
                                    </div>
                                    <div className="col-sm-6 mb-3">
                                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">{__('messages.admin_domain')}</div>
                                        <p className="mb-0 text-gray-800">{tenant.domain}</p>
                                    </div>
                                    <div className="col-sm-6 mb-3">
                                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">{__('messages.admin_status')}</div>
                                        <span className={`badge ${tenant.status ? 'badge-success' : 'badge-danger'}`}>
                                            {tenant.status ? __('messages.admin_status_active') : __('messages.admin_status_inactive')}
                                        </span>
                                    </div>
                                    <div className="col-sm-6 mb-3">
                                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">{__('messages.admin_monthly_limit')}</div>
                                        <p className="mb-0 text-gray-800">{tenant.monthly_limit}</p>
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-2">{__('messages.admin_brand_colors')}</div>
                                    <div className="d-flex gap-3">
                                        {tenant.primary_color && (
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="border" style={{ width: '2rem', height: '2rem', backgroundColor: tenant.primary_color }} />
                                                <span className="small text-secondary">{tenant.primary_color}</span>
                                            </div>
                                        )}
                                        {tenant.secondary_color && (
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="border" style={{ width: '2rem', height: '2rem', backgroundColor: tenant.secondary_color }} />
                                                <span className="small text-secondary">{tenant.secondary_color}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {tenant.logo && (
                                    <div className="mt-3">
                                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-2">{__('messages.admin_logo')}</div>
                                        <img src={`/storage/${tenant.logo}`} alt={`${tenant.name} ${__('messages.admin_logo')}`} style={{ height: '4rem', objectFit: 'contain' }} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Settings Card */}
                    <div className="col-lg-4 mb-4">
                        <div className="card shadow mb-4">
                            <div className="card-header py-3">
                                <h6 className="m-0 font-weight-bold text-primary">{__('messages.admin_settings')}</h6>
                            </div>
                            <div className="card-body">
                                {settingsList.length === 0 ? (
                                    <p className="text-secondary mb-0">{__('messages.admin_no_settings')}</p>
                                ) : (
                                    settingsList.map((setting) => (
                                        <div key={setting.key} className="mb-2">
                                            <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">{setting.key.replace(/_/g, ' ')}</div>
                                            <p className="mb-0 text-gray-800 text-break">{setting.value}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submissions Table Card */}
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">{__('messages.admin_submissions')}</h6>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered table-sm">
                                <thead>
                                    <tr>
                                        <th>{__('messages.admin_uuid')}</th>
                                        <th>{__('messages.admin_name')}</th>
                                        <th>{__('messages.admin_email')}</th>
                                        <th>{__('messages.admin_status')}</th>
                                        <th>{__('messages.admin_date')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center py-4">
                                                {__('messages.admin_no_submissions_for_tenant')}
                                            </td>
                                        </tr>
                                    ) : (
                                        submissions.data.map((sub) => (
                                            <tr key={sub.uuid}>
                                                <td className="font-monospace">{sub.uuid.substring(0, 8)}...</td>
                                                <td className="font-weight-bold">{sub.name}</td>
                                                <td>{sub.email}</td>
                                                <td>
                                                    <span className={statusBadge[sub.status] || 'badge badge-secondary'}>
                                                        {sub.status}
                                                    </span>
                                                </td>
                                                <td>{new Date(sub.created_at).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </RootLayout>
    );
}
