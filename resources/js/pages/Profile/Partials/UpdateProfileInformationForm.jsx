import { Link, useForm, usePage } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useTranslation } from '@/hooks/useTranslation';

export default function UpdateProfileInformationForm({ mustVerifyEmail, status }) {
    const { __ } = useTranslation();
    const user = usePage().props.auth.user;

    const form = useForm({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        city: user.city || '',
    });

    const submit = (e) => {
        e.preventDefault();
        form.patch(route('profile.update'));
    };

    return (
        <section>
            <header>
                <h2 className="text-lg font-medium text-gray-900">{__('messages.profile_information_title')}</h2>
                <p className="mt-1 text-sm text-gray-600">{__('messages.profile_information_description')}</p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value={__('messages.form_label_name')} />
                    <TextInput
                        id="name"
                        type="text"
                        className="mt-1 block w-full"
                        value={form.data.name}
                        onChange={(v) => form.setData('name', v)}
                        required
                        autofocus
                        autocomplete="name"
                    />
                    <InputError className="mt-2" message={form.errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value={__('messages.form_label_email')} />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={form.data.email}
                        onChange={(v) => form.setData('email', v)}
                        required
                        autocomplete="username"
                    />
                    <InputError className="mt-2" message={form.errors.email} />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="phone" value={__('messages.form_label_phone')} />
                    <TextInput
                        id="phone"
                        type="tel"
                        className="mt-1 block w-full"
                        value={form.data.phone}
                        onChange={(v) => form.setData('phone', v)}
                        autocomplete="tel"
                    />
                    <InputError className="mt-2" message={form.errors.phone} />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="city" value={__('messages.form_label_city')} />
                    <TextInput
                        id="city"
                        type="text"
                        className="mt-1 block w-full"
                        value={form.data.city}
                        onChange={(v) => form.setData('city', v)}
                        autocomplete="address-level2"
                    />
                    <InputError className="mt-2" message={form.errors.city} />
                </div>

                {mustVerifyEmail && !user.email_verified_at && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            {__('messages.profile_unverified_email')}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover-text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                {__('messages.profile_verification_link')}
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                {__('messages.profile_verification_sent')}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={form.processing}>{__('messages.button_save')}</PrimaryButton>

                    {form.recentlySuccessful && (
                        <p className="text-sm text-gray-600">{__('messages.profile_information_saved')}</p>
                    )}
                </div>
            </form>
        </section>
    );
}
