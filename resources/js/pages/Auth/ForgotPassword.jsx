import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
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
        <GuestLayout>
            <Head title={__('messages.auth_forgot_password_title')} />

            <div className="mb-3 small text-secondary">
                {__('messages.auth_forgot_password_intro')}
            </div>

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

                <div className="mt-4 d-flex align-items-center justify-content-end">
                    <PrimaryButton disabled={form.processing}>
                        {__('messages.auth_forgot_password_button')}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
