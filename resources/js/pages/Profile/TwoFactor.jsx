import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { useTranslation } from '@/hooks/useTranslation';

export default function TwoFactor({ enabled }) {
    const { __ } = useTranslation();
    const { flash } = usePage().props;

    const { post, processing } = useForm({});

    function handleEnable() {
        post(route('profile.two-factor.enable'));
    }

    function handleDisable() {
        if (confirm(__('messages.admin_confirm_disable_2fa'))) {
            post(route('profile.two-factor.disable'));
        }
    }

    return (
        <>
            <Head title={__('messages.two_factor')} />

            <AuthenticatedLayout>
                <div className="py-5">
                    <div className="mx-auto px-3 px-sm-4 px-lg-5" style={{ maxWidth: '80rem' }}>
                        <h2 className="fs-4 fw-bold text-body mb-4">{__('messages.two_factor')}</h2>

                        {flash?.success && <div className="alert alert-success mb-4">{flash.success}</div>}

                        <div className="rounded-4 border border-secondary bg-white p-4 shadow-sm">
                            {enabled ? (
                                <div>
                                    <div className="mb-4">
                                        <span className="badge bg-success mb-2">{__('messages.enabled')}</span>
                                        <p className="text-body small">{__('messages.two_factor_enabled_desc')}</p>
                                    </div>
                                    <button onClick={handleDisable} className="btn btn-outline-danger" disabled={processing}>
                                        {__('messages.disable_two_factor')}
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-body small mb-3">{__('messages.two_factor_disabled_desc')}</p>
                                    <button onClick={handleEnable} className="btn btn-primary" disabled={processing}>
                                        {__('messages.enable_two_factor')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
