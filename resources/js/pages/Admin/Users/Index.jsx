import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import RootLayout from '@/layouts/RootLayout';
import { useTranslation } from '@/hooks/useTranslation';
import { useState } from 'react';

export default function UsersIndex() {
    const { __ } = useTranslation();
    const { users, availableRoles = ['admin'], filters = {} } = usePage().props;
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ name: '', email: '' });

    const [filterSearch, setFilterSearch] = useState(filters.search || '');
    const [filterRole, setFilterRole] = useState(filters.role || '');
    const [filterCity, setFilterCity] = useState(filters.city || '');

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
    });

    function handleCreate(e) {
        e.preventDefault();
        post(route('admin.users.store'), {
            onSuccess: () => {
                reset();
                document.querySelector('[data-bs-dismiss="offcanvas"]')?.click();
            },
        });
    }

    function startEdit(user) {
        setEditingId(user.id);
        setEditData({ name: user.name, email: user.email });
    }

    function cancelEdit() {
        setEditingId(null);
        setEditData({ name: '', email: '' });
    }

    function saveEdit(id) {
        router.put(route('admin.users.update', id), editData, {
            onFinish: () => cancelEdit(),
        });
    }

    function handleRoleChange(id, role) {
        router.put(route('admin.users.role', id), { role });
    }

    function handleDelete(id) {
        if (confirm(__('messages.admin_confirm_delete'))) {
            router.delete(route('admin.users.destroy', id));
        }
    }

    function applyFilters() {
        const params = {};
        if (filterSearch.trim()) params.search = filterSearch.trim();
        if (filterRole) params.role = filterRole;
        if (filterCity.trim()) params.city = filterCity.trim();
        router.get(route('admin.users.index'), params, {
            preserveState: false,
            preserveScroll: true,
        });
    }

    function clearFilters() {
        setFilterSearch('');
        setFilterRole('');
        setFilterCity('');
        router.get(route('admin.users.index'), {}, {
            preserveState: false,
            preserveScroll: true,
        });
    }

    const hasActiveFilters = filterSearch.trim() || filterRole || filterCity.trim();

    return (
        <>
            <Head title={__('messages.admin_users')} />

            <RootLayout>
                <div className="container-fluid">
                    <div className="d-sm-flex align-items-center justify-content-between mb-4">
                        <h1 className="h3 mb-0 text-gray-800">{__('messages.admin_users')}</h1>
                        <button
                            className="btn btn-primary btn-sm"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#userOffcanvas"
                            aria-controls="userOffcanvas"
                        >
                            <i className="fas fa-plus me-1"></i>
                            {__('messages.admin_create_user')}
                        </button>
                    </div>

                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <div className="row g-2 align-items-end">
                                <div className="col-md-4">
                                    <label className="small fw-bold text-primary">{__('messages.admin_search_placeholder')}</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder={__('messages.admin_name')}
                                        value={filterSearch}
                                        onChange={(e) => setFilterSearch(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="small fw-bold text-primary">{__('messages.admin_role')}</label>
                                    <select className="form-select form-select-sm" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                                        <option value="">--</option>
                                        {availableRoles.map((role) => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label className="small fw-bold text-primary">{__('messages.admin_city')}</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder={__('messages.admin_city')}
                                        value={filterCity}
                                        onChange={(e) => setFilterCity(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-2 d-flex gap-1">
                                    <button className="btn btn-primary btn-sm flex-grow-1" onClick={applyFilters}>
                                        <i className="fas fa-search me-1"></i>
                                        {__('messages.button_search')}
                                    </button>
                                    {hasActiveFilters && (
                                        <button className="btn btn-outline-secondary btn-sm" onClick={clearFilters}>
                                            <i className="fas fa-times"></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-bordered table-hover table-sm">
                                    <thead>
                                        <tr>
                                            <th>{__('messages.admin_name')}</th>
                                            <th>{__('messages.admin_email')}</th>
                                            <th>{__('messages.admin_phone')}</th>
                                            <th>{__('messages.admin_city')}</th>
                                            <th>{__('messages.admin_roles')}</th>
                                            <th>{__('messages.admin_created')}</th>
                                            <th>{__('messages.admin_actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users?.data?.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="text-center text-muted">
                                                    {hasActiveFilters ? __('messages.ui_no_results') : __('messages.admin_no_users')}
                                                </td>
                                            </tr>
                                        ) : (
                                            users?.data?.map((user) => (
                                                <tr key={user.id}>
                                                    <td className="text-nowrap small fw-medium">
                                                        {editingId === user.id ? (
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-sm"
                                                                value={editData.name}
                                                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                                            />
                                                        ) : (
                                                            user.name
                                                        )}
                                                    </td>
                                                    <td className="text-nowrap small text-secondary">
                                                        {editingId === user.id ? (
                                                            <input
                                                                type="email"
                                                                className="form-control form-control-sm"
                                                                value={editData.email}
                                                                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                                            />
                                                        ) : (
                                                            user.email
                                                        )}
                                                    </td>
                                                    <td className="text-nowrap small text-secondary">
                                                        {user.phone || '-'}
                                                    </td>
                                                    <td className="text-nowrap small text-secondary">
                                                        {user.city || '-'}
                                                    </td>
                                                    <td className="text-nowrap">
                                                        <select
                                                            className="form-select form-select-sm"
                                                            value={user.roles?.[0] || ''}
                                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                        >
                                                            {availableRoles.map((role) => (
                                                                <option key={role} value={role}>{role}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className="text-nowrap small text-secondary">
                                                        {user.created_at
                                                            ? new Date(user.created_at).toLocaleDateString()
                                                            : '-'}
                                                    </td>
                                                    <td className="text-nowrap">
                                                        {editingId === user.id ? (
                                                            <>
                                                                <button
                                                                    className="btn btn-success btn-sm me-1"
                                                                    onClick={() => saveEdit(user.id)}
                                                                >
                                                                    {__('messages.admin_save')}
                                                                </button>
                                                                <button
                                                                    className="btn btn-secondary btn-sm"
                                                                    onClick={cancelEdit}
                                                                >
                                                                    {__('messages.button_cancel')}
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    className="btn btn-outline-primary btn-sm me-1"
                                                                    onClick={() => startEdit(user)}
                                                                >
                                                                    {__('messages.admin_edit')}
                                                                </button>
                                                                <button
                                                                    className="btn btn-outline-danger btn-sm"
                                                                    onClick={() => handleDelete(user.id)}
                                                                >
                                                                    {__('messages.admin_delete')}
                                                                </button>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {users?.links && (
                                <nav className="mt-3">
                                    <ul className="pagination pagination-sm justify-content-center mb-0">
                                        {users.links.map((link, index) => (
                                            <li
                                                key={index}
                                                className={`page-item ${link.active ? 'active' : ''} ${link.url === null ? 'disabled' : ''}`}
                                            >
                                                <Link
                                                    href={link.url || '#'}
                                                    className="page-link"
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                    preserveScroll
                                                    preserveState
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            )}
                        </div>
                    </div>
                </div>

                <div className="offcanvas offcanvas-end" tabIndex="-1" id="userOffcanvas" aria-labelledby="userOffcanvasLabel">
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title" id="userOffcanvasLabel">{__('messages.admin_create_user')}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <form onSubmit={handleCreate}>
                            <div className="mb-3">
                                <label className="small fw-bold text-primary">{__('messages.admin_name')}</label>
                                <input
                                    type="text"
                                    className={`form-control form-control-sm ${errors.name ? 'is-invalid' : ''}`}
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="small fw-bold text-primary">{__('messages.admin_email')}</label>
                                <input
                                    type="email"
                                    className={`form-control form-control-sm ${errors.email ? 'is-invalid' : ''}`}
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="small fw-bold text-primary">{__('messages.form_label_password')}</label>
                                <input
                                    type="password"
                                    className={`form-control form-control-sm ${errors.password ? 'is-invalid' : ''}`}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="small fw-bold text-primary">{__('messages.form_label_confirm_password')}</label>
                                <input
                                    type="password"
                                    className="form-control form-control-sm"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="small fw-bold text-primary">{__('messages.admin_role')}</label>
                                <select
                                    className={`form-select form-select-sm ${errors.role ? 'is-invalid' : ''}`}
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                >
                                    <option value="">{__('messages.admin_select_role')}</option>
                                    {availableRoles.map((role) => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                                {errors.role && <div className="invalid-feedback">{errors.role}</div>}
                            </div>
                            <button type="submit" className="btn btn-primary w-100" disabled={processing}>
                                {processing ? __('messages.ui_submitting') : __('messages.admin_save')}
                            </button>
                        </form>
                    </div>
                </div>
            </RootLayout>
        </>
    );
}
