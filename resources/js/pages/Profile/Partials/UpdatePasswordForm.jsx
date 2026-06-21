import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useTranslation } from '@/hooks/useTranslation';

export default function UpdatePasswordForm() {
    const { __ } = useTranslation();
    const passwordInput = useRef(null);
    const currentPasswordInput = useRef(null);

    const form = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();
        form.put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => form.reset(),
            onError: () => {
                if (form.errors.password) {
                    form.reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }
                if (form.errors.current_password) {
                    form.reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section>
            <header>
                <h2 className="text-lg font-medium text-gray-900">{__('messages.profile_update_password_title')}</h2>
                <p className="mt-1 text-sm text-gray-600">{__('messages.profile_update_password_description')}</p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="current_password" value={__('messages.form_label_current_password')} />
                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={form.data.current_password}
                        onChange={(v) => form.setData('current_password', v)}
                        type="password"
                        className="mt-1 block w-full"
                        autocomplete="current-password"
                    />
                    <InputError className="mt-2" message={form.errors.current_password} />
                </div>

                <div>
                    <InputLabel htmlFor="password" value={__('messages.form_label_new_password')} />
                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={form.data.password}
                        onChange={(v) => form.setData('password', v)}
                        type="password"
                        className="mt-1 block w-full"
                        autocomplete="new-password"
                    />
                    <InputError className="mt-2" message={form.errors.password} />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value={__('messages.form_label_confirm_password')} />
                    <TextInput
                        id="password_confirmation"
                        value={form.data.password_confirmation}
                        onChange={(v) => form.setData('password_confirmation', v)}
                        type="password"
                        className="mt-1 block w-full"
                        autocomplete="new-password"
                    />
                    <InputError className="mt-2" message={form.errors.password_confirmation} />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={form.processing}>{__('messages.button_save')}</PrimaryButton>

                    {form.recentlySuccessful && (
                        <p className="text-sm text-gray-600">{__('messages.ui_saved')}</p>
                    )}
                </div>
            </form>
        </section>
    );
}
