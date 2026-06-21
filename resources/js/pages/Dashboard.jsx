import { Head } from '@inertiajs/react';
import { useMemo } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import RootLayout from '@/layouts/RootLayout';
import { useTranslation } from '@/hooks/useTranslation';

const statusBadge = {
    pending: 'bg-warning bg-opacity-25 text-warning',
    processing: 'bg-info bg-opacity-25 text-info',
    completed: 'bg-success bg-opacity-25 text-success',
    failed: 'bg-danger bg-opacity-25 text-danger',
};

const emptyStatsValue = '—';

export default function Dashboard({ stats, recentSubmissions }) {
    const isAdmin = window.location.pathname.startsWith('/admin');
    const Layout = isAdmin ? RootLayout : AuthenticatedLayout;
    const { __ } = useTranslation();

    const statCards = useMemo(() => [
        { label: __('messages.dashboard_daily_submissions'), value: stats?.daily_submissions ?? emptyStatsValue, icon: '📥', color: 'bg-primary bg-opacity-10 text-primary' },
        { label: __('messages.dashboard_monthly_total'), value: stats?.monthly_total ?? emptyStatsValue, icon: '📈', color: 'bg-primary bg-opacity-10 text-primary' },
        { label: __('messages.dashboard_success_rate'), value: stats ? `${stats.success_rate}%` : emptyStatsValue, icon: '✅', color: 'bg-success bg-opacity-10 text-success' },
        { label: __('messages.dashboard_error_rate'), value: stats ? `${stats.error_rate}%` : emptyStatsValue, icon: '❌', color: 'bg-danger bg-opacity-10 text-danger' },
    ], [stats]);

    return (
        <>
            <Head title={__('messages.dashboard_title')} />

            <Layout>
                <div className="py-5">
                    <div className="mx-auto px-3 px-sm-4 px-lg-5" style={{ maxWidth: '80rem' }}>
                        {stats ? (
                            <>
                                <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
                                    {statCards.map((card) => (
                                        <div key={card.label} className="rounded-4 border border-secondary bg-white p-4 shadow-sm">
                                            <div className="mb-3 d-flex align-items-center justify-content-between">
                                                <span className="fs-3">{card.icon}</span>
                                                <span className={`small fw-medium rounded-pill px-2 py-1 ${card.color}`}>
                                                    {card.label}
                                                </span>
                                            </div>
                                            <p className="fs-1 fw-bold text-body mb-0">{card.value}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-5 overflow-hidden rounded-4 border border-secondary bg-white shadow-sm">
                                    <div className="border-bottom border-secondary px-4 py-3">
                                        <h3 className="fs-6 fw-semibold text-body mb-0">{__('messages.dashboard_recent_submissions')}</h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="table align-middle mb-0">
                                            <thead className="bg-light">
                                                <tr>
                                                    <th className="px-4 py-3 text-start small fw-medium text-uppercase text-muted">{__('messages.admin_name')}</th>
                                                    <th className="px-4 py-3 text-start small fw-medium text-uppercase text-muted">{__('messages.admin_email')}</th>
                                                    <th className="px-4 py-3 text-start small fw-medium text-uppercase text-muted">{__('messages.admin_status')}</th>
                                                    <th className="px-4 py-3 text-start small fw-medium text-uppercase text-muted">{__('messages.admin_date')}</th>
                                                </tr>
                                            </thead>
                                            <tbody className="border-top border-secondary">
                                                {recentSubmissions?.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={4} className="px-4 py-5 text-center text-muted">
                                                            {__('messages.dashboard_no_submissions')}
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    recentSubmissions?.map((sub) => (
                                                        <tr key={sub.uuid} className="transition hover-bg-light">
                                                            <td className="text-nowrap px-4 py-3 small fw-medium text-body">{sub.name}</td>
                                                            <td className="text-nowrap px-4 py-3 small text-secondary">{sub.email}</td>
                                                            <td className="text-nowrap px-4 py-3">
                                                                <span className={`d-inline-flex align-items-center rounded-pill px-2 py-1 small fw-medium ${statusBadge[sub.status] || 'bg-light text-secondary'}`}>
                                                                    {sub.status}
                                                                </span>
                                                            </td>
                                                            <td className="text-nowrap px-4 py-3 small text-secondary">{new Date(sub.created_at).toLocaleDateString()}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="overflow-hidden rounded-3 bg-white shadow-sm">
                                <div className="p-4 text-body">
                                    {__('messages.dashboard_logged_in')}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Layout>
        </>
    );
}
