import { Head, useForm, usePage } from '@inertiajs/react';
import RootLayout from '@/layouts/RootLayout';
import { useTranslation } from '@/hooks/useTranslation';

export default function CacheIndex({ stats }) {
    const { __ } = useTranslation();
    const { flash } = usePage().props;

    const { post, processing } = useForm({});

    function handleClear() {
        if (confirm(__('messages.admin_confirm_clear_cache'))) {
            post(route('admin.cache.clear'));
        }
    }

    const configItems = [
        { label: __('messages.cache_driver'), value: stats.cache_driver },
        { label: __('messages.session_driver'), value: stats.session_driver },
        { label: __('messages.queue_connection'), value: stats.queue_connection },
        { label: __('messages.app_environment'), value: stats.app_env },
        { label: __('messages.app_debug'), value: stats.app_debug ? 'true' : 'false' },
        { label: __('messages.php_version'), value: stats.php_version },
        { label: __('messages.laravel_version'), value: stats.laravel_version },
    ];

    return (
        <>
            <Head title={__('messages.admin_cache')} />

            <RootLayout>
                <div className="container-fluid">
                    <div className="d-sm-flex align-items-center justify-content-between mb-4">
                        <h1 className="h3 mb-0 text-gray-800">{__('messages.admin_cache')}</h1>
                    </div>

                    {flash?.success && <div className="alert alert-success">{flash.success}</div>}

                    <div className="row">
                        <div className="col-lg-8">
                            <div className="card shadow mb-4">
                                <div className="card-header py-3">
                                    <h6 className="m-0 font-weight-bold text-primary">{__('messages.system_configuration')}</h6>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-sm">
                                            <tbody>
                                                {configItems.map(item => (
                                                    <tr key={item.label}>
                                                        <td className="small fw-medium text-gray-600" style={{ width: '40%' }}>{item.label}</td>
                                                        <td className="small text-gray-800">{item.value}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="card shadow mb-4">
                                <div className="card-header py-3">
                                    <h6 className="m-0 font-weight-bold text-primary">{__('messages.admin_actions')}</h6>
                                </div>
                                <div className="card-body">
                                    <button onClick={handleClear} className="btn btn-warning btn-block" disabled={processing}>
                                        {__('messages.clear_cache')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </RootLayout>
        </>
    );
}
