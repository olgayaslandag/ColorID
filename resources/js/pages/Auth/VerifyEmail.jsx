import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import { useTranslation } from '@/hooks/useTranslation';

export default function VerifyEmail({ status }) {
    const { __ } = useTranslation();

    const form = useForm({});

    const submit = (e) => {
        e.preventDefault();
        form.post(route('verification.send'));
    };

    const verificationLinkSent = status === 'verification-link-sent';

    return (
        <GuestLayout imageClass="bg-login-image">
            <Head title={__('messages.auth_verify_email_title')} />

            <div className="text-center">
                <h1 className="h4 text-gray-900 mb-2">{__('messages.auth_verify_email_title')}</h1>
                <p className="mb-4 text-gray-500">{__('messages.auth_verify_email_intro')}</p>
            </div>

            {verificationLinkSent && (
                <div className="mb-3 small fw-medium text-success">
                    {__('messages.auth_verify_email_sent')}
                </div>
            )}

            <form className="user" onSubmit={submit}>
                <button
                    type="submit"
                    className="btn btn-primary btn-user btn-block"
                    disabled={form.processing}
                >
                    {__('messages.auth_verify_email_resend')}
                </button>
            </form>

            <hr />

            <div className="text-center">
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="small btn btn-link text-gray-900 p-0 border-0"
                >
                    {__('messages.nav_logout')}
                </Link>
            </div>
        </GuestLayout>
    );
}
