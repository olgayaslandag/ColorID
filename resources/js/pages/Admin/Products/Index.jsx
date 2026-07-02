import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import RootLayout from '@/layouts/RootLayout';
import { useTranslation } from '@/hooks/useTranslation';

export default function ProductsIndex() {
    const { __ } = useTranslation();
    const { products, tenants, categories, filters = {} } = usePage().props;
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ name: '', tenant_id: '', category_ids: [] });
    const [editErrors, setEditErrors] = useState({});
    const [processingEdit, setProcessingEdit] = useState(false);

    const [filterSearch, setFilterSearch] = useState(filters.search || '');
    const [filterTenant, setFilterTenant] = useState(filters.tenant_id || '');
    const [filterCategory, setFilterCategory] = useState(filters.category_id || '');

    const { data, setData, post, processing, errors, reset } = useForm({ name: '', tenant_id: '', category_ids: [] });

    function handleCreate(e) {
        e.preventDefault();
        post(route('admin.products.store'), {
            onSuccess: () => {
                reset();
                document.querySelector('[data-bs-dismiss="offcanvas"]')?.click();
            },
        });
    }

    function handleCreateCategoryChange(e) {
        const selected = Array.from(e.target.options).filter((o) => o.selected).map((o) => Number(o.value));
        setData('category_ids', selected);
    }

    function startEdit(product) {
        setEditingId(product.id);
        setEditData({
            name: product.name,
            tenant_id: product.tenant_id || '',
            category_ids: (product.categories || []).map((c) => c.id),
        });
    }

    function cancelEdit() { setEditingId(null); }

    function handleEditCategoryChange(e) {
        const selected = Array.from(e.target.options).filter((o) => o.selected).map((o) => Number(o.value));
        setEditData((prev) => ({ ...prev, category_ids: selected }));
    }

    function saveEdit(id) {
        setProcessingEdit(true);
        router.put(route('admin.products.update', id), editData, {
            onSuccess: () => { cancelEdit(); setEditErrors({}); setProcessingEdit(false); },
            onError: (errors) => { setEditErrors(errors || {}); setProcessingEdit(false); },
            onFinish: () => null,
        });
    }

    function handleDelete(id) {
        if (confirm(__('messages.ui_confirm'))) router.delete(route('admin.products.destroy', id));
    }

    function applyFilters() {
        const params = {};
        if (filterSearch.trim()) params.search = filterSearch.trim();
        if (filterTenant) params.tenant_id = filterTenant;
        if (filterCategory) params.category_id = filterCategory;
        router.get(route('admin.products.index'), params, {
            preserveState: false,
            preserveScroll: true,
        });
    }

    function clearFilters() {
        setFilterSearch('');
        setFilterTenant('');
        setFilterCategory('');
        router.get(route('admin.products.index'), {}, {
            preserveState: false,
            preserveScroll: true,
        });
    }

    const hasActiveFilters = filterSearch.trim() || filterTenant || filterCategory;
    const items = products.data || [];

    return (
        <RootLayout>
            <Head title={__('messages.admin_products')} />
            <div className="container-fluid">
                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">{__('messages.admin_products')}</h1>
                    <button
                        className="btn btn-primary btn-sm"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#productOffcanvas"
                        aria-controls="productOffcanvas"
                    >
                        <i className="fas fa-plus me-1"></i>
                        {__('messages.brand_add_product')}
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
                                    placeholder={__('messages.brand_product_name')}
                                    value={filterSearch}
                                    onChange={(e) => setFilterSearch(e.target.value)}
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="small fw-bold text-primary">{__('messages.hesap_name')}</label>
                                <select className="form-select form-select-sm" value={filterTenant} onChange={(e) => setFilterTenant(e.target.value)}>
                                    <option value="">--</option>
                                    {tenants.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="small fw-bold text-primary">{__('messages.brand_category_name')}</label>
                                <select className="form-select form-select-sm" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                                    <option value="">--</option>
                                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
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
                                        <th>{__('messages.brand_product_name')}</th>
                                        <th>{__('messages.hesap_name')}</th>
                                        <th>{__('messages.brand_category_name')}</th>
                                        <th>{__('messages.admin_swatches')}</th>
                                        <th>{__('messages.admin_actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.length === 0 ? (
                                        <tr><td colSpan={5} className="text-center text-muted">
                                            {hasActiveFilters ? __('messages.ui_no_results') : __('messages.admin_no_products')}
                                        </td></tr>
                                    ) : items.map((product) => (
                                        <tr key={product.id}>
                                            <td className="text-nowrap small fw-medium">
                                                {editingId === product.id ? (
                                                    <>
                                                        <input type="text" className={`form-control form-control-sm ${editErrors.name ? 'is-invalid' : ''}`} value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
                                                        {editErrors.name && <div className="invalid-feedback d-block">{editErrors.name}</div>}
                                                    </>
                                                ) : product.name}
                                            </td>
                                            <td className="text-nowrap small text-secondary">
                                                {editingId === product.id ? (
                                                    <>
                                                        <select className={`form-select form-select-sm ${editErrors.tenant_id ? 'is-invalid' : ''}`} value={editData.tenant_id} onChange={(e) => setEditData({ ...editData, tenant_id: e.target.value })}>
                                                            <option value="">--</option>
                                                            {tenants.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                                                        </select>
                                                        {editErrors.tenant_id && <div className="invalid-feedback d-block">{editErrors.tenant_id}</div>}
                                                    </>
                                                ) : (product.tenant_name || '-')}
                                            </td>
                                            <td className="text-nowrap small text-secondary">
                                                {editingId === product.id ? (
                                                    <select multiple className="form-select form-select-sm" style={{ minHeight: '5rem' }} value={editData.category_ids} onChange={handleEditCategoryChange}>
                                                        {categories.map((c) => (
                                                            <option key={c.id} value={c.id}>{c.name}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <div className="d-flex flex-wrap gap-1">
                                                        {(product.categories || []).length > 0
                                                            ? product.categories.map((c) => <span key={c.id} className="badge badge-info">{c.name}</span>)
                                                            : '-'}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="text-nowrap small text-secondary">
                                                {product.swatches_count > 0 ? (
                                                    <Link href={route('admin.swatches.index', { product_id: product.id })} className="fw-semibold text-primary text-decoration-none">
                                                        {product.swatches_count}
                                                    </Link>
                                                ) : product.swatches_count}
                                            </td>
                                            <td className="text-nowrap">
                                                {editingId === product.id ? (
                                                    <>
                                                        <button className="btn btn-success btn-sm me-1" onClick={() => saveEdit(product.id)} disabled={processingEdit}>{__('messages.admin_save')}</button>
                                                        <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>{__('messages.button_cancel')}</button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button className="btn btn-outline-primary btn-sm me-1" onClick={() => startEdit(product)}>{__('messages.admin_edit')}</button>
                                                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(product.id)}>{__('messages.admin_delete')}</button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {products?.links && (
                            <nav className="mt-3">
                                <ul className="pagination pagination-sm justify-content-center mb-0">
                                    {products.links.map((link, index) => (
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

            <div className="offcanvas offcanvas-end" tabIndex="-1" id="productOffcanvas" aria-labelledby="productOffcanvasLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="productOffcanvasLabel">{__('messages.brand_add_product')}</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <form onSubmit={handleCreate}>
                        <div className="mb-3">
                            <label className="small font-weight-bold text-primary">{__('messages.brand_product_name')}</label>
                            <input type="text" className={`form-control form-control-sm ${errors.name ? 'is-invalid' : ''}`} value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="small font-weight-bold text-primary">{__('messages.hesap_name')}</label>
                            <select className={`form-select form-select-sm ${errors.tenant_id ? 'is-invalid' : ''}`} value={data.tenant_id} onChange={(e) => setData('tenant_id', e.target.value)}>
                                <option value="">--</option>
                                {tenants.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                            {errors.tenant_id && <div className="invalid-feedback">{errors.tenant_id}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="small font-weight-bold text-primary">{__('messages.brand_category_name')}</label>
                            <select multiple className="form-select form-select-sm" style={{ minHeight: '6rem' }} value={data.category_ids} onChange={handleCreateCategoryChange}>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary w-100" disabled={processing}>
                            {processing ? __('messages.ui_processing') : __('messages.brand_add_product')}
                        </button>
                    </form>
                </div>
            </div>
        </RootLayout>
    );
}
