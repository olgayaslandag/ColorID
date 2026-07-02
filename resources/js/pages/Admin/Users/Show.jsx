import { Head, Link, useForm, usePage } from '@inertiajs/react';
import RootLayout from '@/layouts/RootLayout';
import { useTranslation } from '@/hooks/useTranslation';

export default function UsersShow({ user, availableRoles }) {
    const { __ } = useTranslation();
    const { flash } = usePage().props;

    const { data, setData, put, delete: destroy, processing } = useForm({
        name: user.name,
        email: user.email,
    });

    const { data: roleData, setData: setRoleData, put: updateRole, processing: roleProcessing } = useForm({
        role: user.roles?.[0] || '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        put(route('admin.users.update', user.id));
    }

    function handleRoleUpdate(e) {
        e.preventDefault();
        updateRole(route('admin.users.role', user.id));
    }

    function handleDelete() {
        if (confirm(__('messages.admin_confirm_delete'))) {
            destroy(route('admin.users.destroy', user.id));
        }
    }

    return (
        <>
            <Head title={user.name} />

            <RootLayout>
                <div className="container-fluid">
                    <div className="d-sm-flex align-items-center justify-content-between mb-4">
                        <div>
                            <Link href={route('admin.users.index')} className="text-secondary text-decoration-none small">
                                &larr; {__('messages.admin_back_to_users')}
                            </Link>
                            <h1 className="h3 mb-0 text-gray-800 mt-2">{user.name}</h1>
                        </div>
                        <button onClick={handleDelete} className="btn btn-danger btn-sm">
                            {__('messages.admin_delete_user')}
                        </button>
                    </div>

                    {flash?.success && (
                        <div className="alert alert-success">{flash.success}</div>
                    )}
                    {flash?.error && (
                        <div className="alert alert-danger">{flash.error}</div>
                    )}

                    <div className="row">
                        <div className="col-lg-6">
                            <div className="card shadow mb-4">
                                <div className="card-header py-3">
                                    <h6 className="m-0 font-weight-bold text-primary">{__('messages.admin_user_details')}</h6>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <label className="form-label">{__('messages.admin_name')}</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">{__('messages.admin_email')}</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary" disabled={processing}>
                                            {__('messages.admin_save')}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="card shadow mb-4">
                                <div className="card-header py-3">
                                    <h6 className="m-0 font-weight-bold text-primary">{__('messages.admin_user_roles')}</h6>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleRoleUpdate}>
                                        <div className="form-group">
                                            <label className="form-label">{__('messages.admin_role')}</label>
                                            <select
                                                className="form-control"
                                                value={roleData.role}
                                                onChange={(e) => setRoleData('role', e.target.value)}
                                            >
                                                <option value="">{__('messages.admin_select_role')}</option>
                                                {availableRoles?.map((role) => (
                                                    <option key={role} value={role}>{role}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <button type="submit" className="btn btn-primary" disabled={roleProcessing}>
                                            {__('messages.admin_update_role')}
                                        </button>
                                    </form>
                                </div>
                            </div>

                            <div className="card shadow mb-4">
                                <div className="card-header py-3">
                                    <h6 className="m-0 font-weight-bold text-primary">{__('messages.admin_user_info')}</h6>
                                </div>
                                <div className="card-body small">
                                    <p className="mb-1"><strong>{__('messages.admin_email_verified')}:</strong> {user.email_verified_at ? __('messages.yes') : __('messages.no')}</p>
                                    <p className="mb-1"><strong>{__('messages.admin_created_at')}:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
                                    <p className="mb-0"><strong>{__('messages.admin_updated_at')}:</strong> {new Date(user.updated_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </RootLayout>
        </>
    );
}
