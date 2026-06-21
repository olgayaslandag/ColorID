import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useTranslation } from '@/hooks/useTranslation';

export default function ConfirmPassword() {
    const { __ } = useTranslation();

    const form = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        form.post(route('password.confirm'), {
            onFinish: () => form.reset(),
        });
    };

    return (
        <GuestLayout>
            <Head title={__('messages.auth_confirm_password_title')} />

            <div className="mb-3 small text-secondary">
                {__('messages.auth_confirm_password_intro')}
            </div>

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="password" value={__('messages.form_label_password')} />
                    <TextInput
                        id="password"
                        type="password"
                        className="mt-1 w-100"
                        value={form.data.password}
                        onChange={(v) => form.setData('password', v)}
                        required
                        autocomplete="current-password"
                        autofocus
                    />
                    <InputError className="mt-2" message={form.errors.password} />
                </div>

                <div className="mt-4 d-flex justify-content-end">
                    <PrimaryButton className="ms-4" disabled={form.processing}>
                        {__('messages.auth_confirm_password_button')}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
