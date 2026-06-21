import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import PrimaryButton from '@/Components/PrimaryButton';
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
        <GuestLayout>
            <Head title={__('messages.auth_verify_email_title')} />

            <div className="mb-3 small text-secondary">
                {__('messages.auth_verify_email_intro')}
            </div>

            {verificationLinkSent && (
                <div className="mb-3 small fw-medium text-success">
                    {__('messages.auth_verify_email_sent')}
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-4 d-flex align-items-center justify-content-between">
                    <PrimaryButton disabled={form.processing}>
                        {__('messages.auth_verify_email_resend')}
                    </PrimaryButton>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="small text-secondary text-decoration-underline hover-text-body focus:outline-none"
                    >
                        {__('messages.nav_logout')}
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
