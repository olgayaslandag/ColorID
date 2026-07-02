import { Head, Link, useForm, usePage } from '@inertiajs/react';
import RootLayout from '@/layouts/RootLayout';
import { useTranslation } from '@/hooks/useTranslation';

export default function TenantApiKey({ tenant, hasApiKey }) {
    const { __ } = useTranslation();
    const { flash } = usePage().props;

    const { data, setData, put, processing, errors } = useForm({
        api_key: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        put(route('admin.tenants.api-key.update', tenant.id));
    }

    return (
        <>
            <Head title={`${tenant.name} - ${__('messages.admin_api_key')}`} />

            <RootLayout>
                <div className="container-fluid">
                    <div className="d-sm-flex align-items-center justify-content-between mb-4">
                        <div>
                            <Link href={route('admin.tenants.show', tenant.id)} className="text-secondary text-decoration-none small">
                                &larr; {__('messages.admin_back_to_tenant')}
                            </Link>
                            <h1 className="h3 mb-0 text-gray-800 mt-2">{tenant.name} - {__('messages.admin_api_key')}</h1>
                        </div>
                    </div>

                    {flash?.success && (
                        <div className="alert alert-success">{flash.success}</div>
                    )}

                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary">{__('messages.admin_api_key')}</h6>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">{__('messages.admin_openai_api_key')}</label>
                                    <input
                                        type="password"
                                        className={`form-control ${errors.api_key ? 'is-invalid' : ''}`}
                                        value={data.api_key}
                                        onChange={(e) => setData('api_key', e.target.value)}
                                        placeholder={hasApiKey ? '••••••••' : __('messages.admin_enter_api_key')}
                                    />
                                    {errors.api_key && <div className="invalid-feedback">{errors.api_key}</div>}
                                    <small className="form-text text-muted">{__('messages.admin_api_key_help')}</small>
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={processing}>
                                    {__('messages.admin_save')}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </RootLayout>
        </>
    );
}
