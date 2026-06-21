import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { useTranslation } from '@/hooks/useTranslation';

export default function Edit({ mustVerifyEmail, status }) {
    const { __ } = useTranslation();

    return (
        <>
            <Head title={__('messages.profile_title')} />

            <AuthenticatedLayout>
                <div className="py-5">
                    <div className="mx-auto d-flex flex-column gap-5 px-3 px-sm-4 px-lg-5" style={{ maxWidth: '80rem' }}>
                        <div className="bg-white p-4 shadow-sm rounded-4 p-sm-5">
                            <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} />
                        </div>

                        <div className="bg-white p-4 shadow-sm rounded-4 p-sm-5">
                            <UpdatePasswordForm />
                        </div>

                        <div className="bg-white p-4 shadow-sm rounded-4 p-sm-5">
                            <DeleteUserForm />
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
