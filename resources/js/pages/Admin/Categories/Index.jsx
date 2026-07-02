import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import RootLayout from '@/layouts/RootLayout';
import { useTranslation } from '@/hooks/useTranslation';

export default function CategoriesIndex() {
    const { __ } = useTranslation();
    const { categories } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editErrors, setEditErrors] = useState({});
    const [processingEdit, setProcessingEdit] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({ name: '' });

    function handleCreate(e) {
        e.preventDefault();
        post(route('admin.categories.store'), { onSuccess: () => reset() });
    }

    function startEdit(cat) {
        setEditingId(cat.id);
        setEditName(cat.name);
    }

    function cancelEdit() { setEditingId(null); }

    function saveEdit(id) {
        setProcessingEdit(true);
        router.put(route('admin.categories.update', id), { name: editName }, {
            onSuccess: () => { cancelEdit(); setEditErrors({}); setProcessingEdit(false); },
            onError: (errors) => { setEditErrors(errors || {}); setProcessingEdit(false); },
        });
    }

    function handleDelete(id) {
        if (confirm(__('messages.ui_confirm'))) router.delete(route('admin.categories.destroy', id));
    }

    const items = categories.data || [];
    const filteredItems = useMemo(() => {
        if (!searchTerm.trim()) return items;
        const q = searchTerm.toLowerCase();
        return items.filter((c) => c.name.toLowerCase().includes(q));
    }, [items, searchTerm]);

    return (
        <RootLayout>
            <Head title={__('messages.admin_categories')} />
            <div className="container-fluid">
                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">{__('messages.admin_categories')}</h1>
                </div>

                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">{__('messages.brand_add_category')}</h6>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleCreate}>
                            <div className="form-row">
                                <div className="col-md-4 mb-3 mb-md-0">
                                    <label className="small font-weight-bold text-primary">{__('messages.brand_category_name')}</label>
                                    <input type="text" className={`form-control form-control-sm ${errors.name ? 'is-invalid' : ''}`} value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                </div>
                                <div className="col-md-2 d-flex align-items-end">
                                    <button type="submit" className="btn btn-primary btn-sm btn-block" disabled={processing}>
                                        {processing ? __('messages.ui_processing') : __('messages.brand_add_category')}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="card shadow mb-4">
                    <div className="card-header py-3 d-flex align-items-center justify-content-between">
                        <h6 className="m-0 font-weight-bold text-primary">{__('messages.admin_categories')}</h6>
                        <div className="input-group input-group-sm" style={{ maxWidth: '260px' }}>
                            <div className="input-group-prepend">
                                <span className="input-group-text bg-white"><i className="fas fa-search text-gray-400"></i></span>
                            </div>
                            <input type="text" className="form-control form-control-sm" placeholder={__('messages.admin_search_placeholder')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            {searchTerm && (
                                <div className="input-group-append">
                                    <button className="btn btn-outline-secondary" type="button" onClick={() => setSearchTerm('')}><i className="fas fa-times"></i></button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover table-sm">
                                <thead>
                                    <tr>
                                        <th>{__('messages.brand_category_name')}</th>
                                        <th>{__('messages.admin_products')}</th>
                                        <th>{__('messages.admin_actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredItems.length === 0 ? (
                                        <tr><td colSpan={3} className="text-center text-muted">
                                            {searchTerm ? __('messages.ui_no_results') : __('messages.admin_no_categories')}
                                        </td></tr>
                                    ) : filteredItems.map((cat) => (
                                        <tr key={cat.id}>
                                            <td className="text-nowrap small fw-medium">
                                                {editingId === cat.id ? (
                                                    <>
                                                        <input type="text" className={`form-control form-control-sm ${editErrors.name ? 'is-invalid' : ''}`} value={editName} onChange={(e) => setEditName(e.target.value)} />
                                                        {editErrors.name && <div className="invalid-feedback d-block">{editErrors.name}</div>}
                                                    </>
                                                ) : cat.name}
                                            </td>
                                            <td className="text-nowrap small text-secondary">{cat.products_count}</td>
                                            <td className="text-nowrap">
                                                {editingId === cat.id ? (
                                                    <>
                                                        <button className="btn btn-success btn-sm me-1" onClick={() => saveEdit(cat.id)} disabled={processingEdit}>{__('messages.admin_save')}</button>
                                                        <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>{__('messages.button_cancel')}</button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button className="btn btn-outline-primary btn-sm me-1" onClick={() => startEdit(cat)}>{__('messages.admin_edit')}</button>
                                                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(cat.id)}>{__('messages.admin_delete')}</button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {categories?.links && (
                            <nav className="mt-3">
                                <ul className="pagination pagination-sm justify-content-center mb-0">
                                    {categories.links.map((link, index) => (
                                        <li key={index} className={`page-item ${link.active ? 'active' : ''} ${link.url === null ? 'disabled' : ''}`}>
                                            <Link href={link.url || '#'} className="page-link" dangerouslySetInnerHTML={{ __html: link.label }} preserveScroll preserveState />
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        )}
                    </div>
                </div>
            </div>
        </RootLayout>
    );
}
