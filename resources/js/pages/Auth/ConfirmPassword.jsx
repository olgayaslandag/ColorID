import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import InputError from '@/Components/InputError';
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
        <GuestLayout imageClass="bg-login-image">
            <Head title={__('messages.auth_confirm_password_title')} />

            <div className="text-center">
                <h1 className="h4 text-gray-900 mb-2">{__('messages.auth_confirm_password_title')}</h1>
                <p className="mb-4 text-gray-500">{__('messages.auth_confirm_password_intro')}</p>
            </div>

            <form className="user" onSubmit={submit}>
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
                        autofocus
                    />
                    <InputError className="mt-2" message={form.errors.password} />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary btn-user btn-block"
                    disabled={form.processing}
                >
                    {__('messages.auth_confirm_password_button')}
                </button>
            </form>
        </GuestLayout>
    );
}
