import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import { useTranslation } from '@/hooks/useTranslation';

export default function ForgotPassword({ status }) {
    const { __ } = useTranslation();

    const form = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        form.post(route('password.email'));
    };

    return (
        <GuestLayout imageClass="bg-password-image">
            <Head title={__('messages.auth_forgot_password_title')} />

            <div className="text-center">
                <h1 className="h4 text-gray-900 mb-2">{__('messages.auth_forgot_password_title')}</h1>
                <p className="mb-4 text-gray-500">{__('messages.auth_forgot_password_intro')}</p>
            </div>

            {status && (
                <div className="mb-3 small fw-medium text-success">{status}</div>
            )}

            <form className="user" onSubmit={submit}>
                <div className="form-group">
                    <TextInput
                        id="email"
                        type="email"
                        className="form-control-user"
                        placeholder={__('messages.form_label_email')}
                        value={form.data.email}
                        onChange={(v) => form.setData('email', v)}
                        required
                        autofocus
                        autocomplete="username"
                    />
                    <InputError className="mt-2" message={form.errors.email} />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary btn-user btn-block"
                    disabled={form.processing}
                >
                    {__('messages.auth_forgot_password_button')}
                </button>
            </form>

            <hr />

            <div className="text-center">
                <Link className="small" href={route('register')}>
                    {__('messages.auth_register_title')}
                </Link>
            </div>

            <div className="text-center">
                <Link className="small" href={route('login')}>
                    {__('messages.nav_login')}
                </Link>
            </div>
        </GuestLayout>
    );
}
