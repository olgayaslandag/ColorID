import { Head, Link, useForm } from '@inertiajs/react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useTranslation } from '@/hooks/useTranslation';

export default function Login({ canResetPassword, status }) {
    const { __ } = useTranslation();

    const form = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        form.post(route('login'), {
            onFinish: () => form.reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title={__('messages.auth_login_title')} />

            {status && (
                <div className="mb-3 small fw-medium text-success">{status}</div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value={__('messages.form_label_email')} />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 w-100"
                        value={form.data.email}
                        onChange={(v) => form.setData('email', v)}
                        required
                        autofocus
                        autocomplete="username"
                    />
                    <InputError className="mt-2" message={form.errors.email} />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value={__('messages.form_label_password')} />
                    <TextInput
                        id="password"
                        type="password"
                        className="mt-1 w-100"
                        value={form.data.password}
                        onChange={(v) => form.setData('password', v)}
                        required
                        autocomplete="current-password"
                    />
                    <InputError className="mt-2" message={form.errors.password} />
                </div>

                <div className="mt-4">
                    <label className="d-flex align-items-center">
                        <Checkbox
                            checked={form.data.remember}
                            onChange={(v) => form.setData('remember', v)}
                        />
                        <span className="ms-2 small text-secondary">{__('messages.form_label_remember_me')}</span>
                    </label>
                </div>

                <div className="mt-4 d-flex align-items-center justify-content-end">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="small text-secondary text-decoration-underline hover-text-body focus:outline-none"
                        >
                            {__('messages.auth_forgot_password_link')}
                        </Link>
                    )}
                    <PrimaryButton
                        className="ms-4"
                        disabled={form.processing}
                    >
                        {__('messages.auth_login_button')}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
