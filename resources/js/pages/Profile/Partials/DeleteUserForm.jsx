import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useTranslation } from '@/hooks/useTranslation';

export default function DeleteUserForm() {
    const { __ } = useTranslation();
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef(null);

    const form = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
        setTimeout(() => passwordInput.current?.focus(), 0);
    };

    const deleteUser = (e) => {
        e.preventDefault();
        form.delete(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => form.reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        form.clearErrors();
        form.reset();
    };

    return (
        <section className="space-y-6">
            <header>
                <h2 className="text-lg font-medium text-gray-900">{__('messages.profile_delete_account_title')}</h2>
                <p className="mt-1 text-sm text-gray-600">{__('messages.profile_delete_account_description')}</p>
            </header>

            <DangerButton onClick={confirmUserDeletion}>{__('messages.profile_delete_account_button')}</DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">{__('messages.profile_delete_account_confirm_title')}</h2>
                    <p className="mt-1 text-sm text-gray-600">{__('messages.profile_delete_account_confirm_description')}</p>

                    <div className="mt-6">
                        <InputLabel htmlFor="password" value={__('messages.form_label_password')} className="sr-only" />
                        <TextInput
                            id="password"
                            ref={passwordInput}
                            value={form.data.password}
                            onChange={(v) => form.setData('password', v)}
                            type="password"
                            className="mt-1 block w-3/4"
                            placeholder={__('messages.form_placeholder_password')}
                            onKeyDown={(e) => { if (e.key === 'Enter') deleteUser(e); }}
                        />
                        <InputError message={form.errors.password} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>{__('messages.button_cancel')}</SecondaryButton>
                        <DangerButton className="ms-3" disabled={form.processing} onClick={deleteUser}>
                            {__('messages.profile_delete_account_button')}
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </section>
    );
}
