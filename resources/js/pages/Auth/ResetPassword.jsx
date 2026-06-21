import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useTranslation } from '@/hooks/useTranslation';

export default function ResetPassword({ email, token }) {
    const { __ } = useTranslation();

    const form = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        form.post(route('password.store'), {
            onFinish: () => form.reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title={__('messages.auth_reset_password_title')} />

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
                        autocomplete="new-password"
                    />
                    <InputError className="mt-2" message={form.errors.password} />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password_confirmation" value={__('messages.form_label_confirm_password')} />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        className="mt-1 w-100"
                        value={form.data.password_confirmation}
                        onChange={(v) => form.setData('password_confirmation', v)}
                        required
                        autocomplete="new-password"
                    />
                    <InputError className="mt-2" message={form.errors.password_confirmation} />
                </div>

                <div className="mt-4 d-flex align-items-center justify-content-end">
                    <PrimaryButton disabled={form.processing}>
                        {__('messages.auth_reset_password_button')}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
