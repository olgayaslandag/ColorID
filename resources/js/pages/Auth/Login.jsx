import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import InputError from '@/Components/InputError';
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
        <GuestLayout imageClass="bg-login-image">
            <Head title={__('messages.auth_login_title')} />

            <div className="text-center">
                <h1 className="h4 text-gray-900 mb-4">{__('messages.auth_login_title')}</h1>
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

                <div className="form-group">
                    <TextInput
                        id="password"
                        type="password"
                        className="form-control-user"
                        placeholder={__('messages.form_label_password')}
                        value={form.data.password}
                        onChange={(v) => form.setData('password', v)}
                        required
                        autocomplete="current-password"
                    />
                    <InputError className="mt-2" message={form.errors.password} />
                </div>

                <div className="form-group">
                    <div className="custom-control custom-checkbox small">
                        <input
                            type="checkbox"
                            className="custom-control-input"
                            id="remember"
                            checked={form.data.remember}
                            onChange={(e) => form.setData('remember', e.target.checked)}
                        />
                        <label className="custom-control-label" htmlFor="remember">
                            {__('messages.form_label_remember_me')}
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary btn-user btn-block"
                    disabled={form.processing}
                >
                    {__('messages.auth_login_button')}
                </button>

                {/*
                <!-- Social login buttons (optional) -->
                <hr>
                <a href="#" className="btn btn-google btn-user btn-block">
                    <i className="fab fa-google fa-fw"></i> Login with Google
                </a>
                <a href="#" className="btn btn-facebook btn-user btn-block">
                    <i className="fab fa-facebook-f fa-fw"></i> Login with Facebook
                </a>
                */}
            </form>

            <hr />

            <div className="text-center">
                {canResetPassword && (
                    <Link className="small" href={route('password.request')}>
                        {__('messages.auth_forgot_password_link')}
                    </Link>
                )}
            </div>

            <div className="text-center">
                <Link className="small" href={route('register')}>
                    {__('messages.nav_register')}
                </Link>
            </div>
        </GuestLayout>
    );
}
