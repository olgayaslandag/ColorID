import { Head } from '@inertiajs/react';
import RootLayout from '@/layouts/RootLayout';
import { useTranslation } from '@/hooks/useTranslation';

export default function QuotaIndex({ tenants }) {
    const { __ } = useTranslation();

    const statusColor = (percentage) => {
        if (percentage >= 90) return 'bg-danger bg-opacity-25 text-danger';
        if (percentage >= 70) return 'bg-warning bg-opacity-25 text-warning';
        return 'bg-success bg-opacity-25 text-success';
    };

    return (
        <>
            <Head title={__('messages.admin_quota')} />

            <RootLayout>
                <div className="container-fluid">
                    <div className="d-sm-flex align-items-center justify-content-between mb-4">
                        <h1 className="h3 mb-0 text-gray-800">{__('messages.admin_quota')}</h1>
                    </div>

                    {tenants?.length === 0 ? (
                        <div className="card shadow mb-4">
                            <div className="card-body text-center text-muted">
                                {__('messages.admin_no_tenants')}
                            </div>
                        </div>
                    ) : (
                        <div className="row">
                            {tenants?.map((tenant) => (
                                <div key={tenant.id} className="col-lg-6 mb-4">
                                    <div className="card shadow h-100">
                                        <div className="card-header py-3 d-flex align-items-center justify-content-between">
                                            <h6 className="m-0 font-weight-bold text-primary">{tenant.name}</h6>
                                            <span className={`badge ${tenant.status ? 'badge-success' : 'badge-secondary'}`}>
                                                {tenant.status ? __('messages.active') : __('messages.inactive')}
                                            </span>
                                        </div>
                                        <div className="card-body">
                                            <p className="small text-gray-600 mb-3">{tenant.domain}</p>

                                            <div className="mb-3">
                                                <div className="d-flex justify-content-between small text-gray-800 mb-1">
                                                    <span>{__('messages.admin_monthly_usage')}</span>
                                                    <span className="fw-medium">{tenant.total_submissions} / {tenant.monthly_limit}</span>
                                                </div>
                                                <div className="progress mb-1" style={{ height: '10px' }}>
                                                    <div
                                                        className={`progress-bar ${tenant.usage_percentage >= 90 ? 'bg-danger' : tenant.usage_percentage >= 70 ? 'bg-warning' : 'bg-success'}`}
                                                        role="progressbar"
                                                        style={{ width: `${Math.min(tenant.usage_percentage, 100)}%` }}
                                                        aria-valuenow={tenant.usage_percentage}
                                                        aria-valuemin="0"
                                                        aria-valuemax="100"
                                                    />
                                                </div>
                                                <span className="small text-gray-600">{tenant.usage_percentage}% {__('messages.admin_used')}</span>
                                            </div>

                                            <div className="d-flex gap-3 small text-gray-600">
                                                <span className="text-success">✓ {tenant.completed_submissions} {__('messages.admin_completed')}</span>
                                                <span className="text-danger">✗ {tenant.failed_submissions} {__('messages.admin_failed')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </RootLayout>
        </>
    );
}
