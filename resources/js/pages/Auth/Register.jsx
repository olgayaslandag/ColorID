import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import InputError from '@/Components/InputError';
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
        <GuestLayout
            imageClass="bg-register-image"
            imageColClass="col-lg-5"
            contentColClass="col-lg-7"
        >
            <Head title={__('messages.auth_register_title')} />

            <div className="text-center">
                <h1 className="h4 text-gray-900 mb-4">{__('messages.auth_register_title')}</h1>
            </div>

            <form className="user" onSubmit={submit}>
                <div className="form-group">
                    <TextInput
                        id="name"
                        type="text"
                        className="form-control-user"
                        placeholder={__('messages.form_label_name')}
                        value={form.data.name}
                        onChange={(v) => form.setData('name', v)}
                        required
                        autofocus
                        autocomplete="name"
                    />
                    <InputError className="mt-2" message={form.errors.name} />
                </div>

                <div className="form-group">
                    <TextInput
                        id="email"
                        type="email"
                        className="form-control-user"
                        placeholder={__('messages.form_label_email')}
                        value={form.data.email}
                        onChange={(v) => form.setData('email', v)}
                        required
                        autocomplete="username"
                    />
                    <InputError className="mt-2" message={form.errors.email} />
                </div>

                <div className="form-group row">
                    <div className="col-sm-6 mb-3 mb-sm-0">
                        <TextInput
                            id="password"
                            type="password"
                            className="form-control-user"
                            placeholder={__('messages.form_label_password')}
                            value={form.data.password}
                            onChange={(v) => form.setData('password', v)}
                            required
                            autocomplete="new-password"
                        />
                        <InputError className="mt-2" message={form.errors.password} />
                    </div>
                    <div className="col-sm-6">
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            className="form-control-user"
                            placeholder={__('messages.form_label_confirm_password')}
                            value={form.data.password_confirmation}
                            onChange={(v) => form.setData('password_confirmation', v)}
                            required
                            autocomplete="new-password"
                        />
                        <InputError className="mt-2" message={form.errors.password_confirmation} />
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary btn-user btn-block"
                    disabled={form.processing}
                >
                    {__('messages.auth_register_button')}
                </button>

                {/*
                <hr>
                <a href="#" className="btn btn-google btn-user btn-block">
                    <i className="fab fa-google fa-fw"></i> Register with Google
                </a>
                <a href="#" className="btn btn-facebook btn-user btn-block">
                    <i className="fab fa-facebook-f fa-fw"></i> Register with Facebook
                </a>
                */}
            </form>

            <hr />

            <div className="text-center">
                <Link className="small" href={route('login')}>
                    {__('messages.auth_register_already')}
                </Link>
            </div>
        </GuestLayout>
    );
}
