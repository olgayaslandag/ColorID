import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useTranslation } from '@/hooks/useTranslation';

export default function Register() {
    const { __ } = useTranslation();

    const form = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        form.post(route('register'), {
            onFinish: () => form.reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title={__('messages.auth_register_title')} />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value={__('messages.form_label_name')} />
                    <TextInput
                        id="name"
                        type="text"
                        className="mt-1 w-100"
                        value={form.data.name}
                        onChange={(v) => form.setData('name', v)}
                        required
                        autofocus
                        autocomplete="name"
                    />
                    <InputError className="mt-2" message={form.errors.name} />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value={__('messages.form_label_email')} />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 w-100"
                        value={form.data.email}
                        onChange={(v) => form.setData('email', v)}
                        required
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
                    <Link
                        href={route('login')}
                        className="small text-secondary text-decoration-underline hover-text-body focus:outline-none"
                    >
                        {__('messages.auth_register_already')}
                    </Link>
                    <PrimaryButton className="ms-4" disabled={form.processing}>
                        {__('messages.auth_register_button')}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
