import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { useTranslation } from '@/hooks/useTranslation';

export default function NotificationPreferences({ preferences }) {
    const { __ } = useTranslation();
    const { flash } = usePage().props;

    const { data, setData, put, processing } = useForm({
        email_submission_completed: preferences?.email_submission_completed ?? true,
        email_submission_failed: preferences?.email_submission_failed ?? true,
        sms_submission_completed: preferences?.sms_submission_completed ?? false,
        sms_submission_failed: preferences?.sms_submission_failed ?? false,
    });

    function handleSubmit(e) {
        e.preventDefault();
        put(route('notifications.update'));
    }

    return (
        <>
            <Head title={__('messages.notification_preferences')} />

            <AuthenticatedLayout>
                <div className="py-5">
                    <div className="mx-auto px-3 px-sm-4 px-lg-5" style={{ maxWidth: '80rem' }}>
                        <h2 className="fs-4 fw-bold text-body mb-4">{__('messages.notification_preferences')}</h2>

                        {flash?.success && (
                            <div className="alert alert-success mb-4">{flash.success}</div>
                        )}

                        <div className="rounded-4 border border-secondary bg-white p-4 shadow-sm">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <h3 className="fs-6 fw-semibold text-body mb-3">{__('messages.email_notifications')}</h3>
                                    <div className="form-check mb-2">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="email_completed"
                                            checked={data.email_submission_completed}
                                            onChange={(e) => setData('email_submission_completed', e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor="email_completed">
                                            {__('messages.notify_email_completed')}
                                        </label>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="email_failed"
                                            checked={data.email_submission_failed}
                                            onChange={(e) => setData('email_submission_failed', e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor="email_failed">
                                            {__('messages.notify_email_failed')}
                                        </label>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h3 className="fs-6 fw-semibold text-body mb-3">{__('messages.sms_notifications')}</h3>
                                    <div className="form-check mb-2">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="sms_completed"
                                            checked={data.sms_submission_completed}
                                            onChange={(e) => setData('sms_submission_completed', e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor="sms_completed">
                                            {__('messages.notify_sms_completed')}
                                        </label>
                                    </div>
                                    <div className="form-check mb-2">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="sms_failed"
                                            checked={data.sms_submission_failed}
                                            onChange={(e) => setData('sms_submission_failed', e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor="sms_failed">
                                            {__('messages.notify_sms_failed')}
                                        </label>
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary" disabled={processing}>
                                    {__('messages.admin_save')}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
