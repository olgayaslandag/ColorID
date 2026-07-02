import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import axios from 'axios';
import RootLayout from '@/layouts/RootLayout';
import { useTranslation } from '@/hooks/useTranslation';

function SortableSwatchCard({ swatch, isEditing, editData, editErrors, onStartEdit, onSaveEdit, onCancelEdit, onDelete, onEditDataChange, onEditValueChange, previewUrls, products, __, processingEdit }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: swatch.id, disabled: isEditing });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className={`swatch-card shadow-sm ${isDragging ? 'dragging' : ''}`}>
            {isEditing ? (
                <div>
                    <div className="mb-2">
                        <label className="small fw-bold text-primary">{__('messages.brand_swatch_name')}</label>
                        <input type="text" className={`form-control form-control-sm ${editErrors.name ? 'is-invalid' : ''}`} value={editData.name} onChange={(e) => onEditDataChange({ ...editData, name: e.target.value })} />
                        {editErrors.name && <div className="invalid-feedback d-block">{editErrors.name}</div>}
                    </div>
                    <div className="mb-2">
                        <label className="small fw-bold text-primary">{__('messages.brand_product_name')}</label>
                        <select className={`form-select form-select-sm ${editErrors.product_id ? 'is-invalid' : ''}`} value={editData.product_id} onChange={(e) => onEditDataChange({ ...editData, product_id: e.target.value })}>
                            <option value="">--</option>
                            {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        {editErrors.product_id && <div className="invalid-feedback d-block">{editErrors.product_id}</div>}
                    </div>
                    <div className="mb-2">
                        <label className="small fw-bold text-primary">{__('messages.brand_swatch_type')}</label>
                        <select className="form-select form-select-sm" value={editData.type} onChange={(e) => onEditDataChange({ ...editData, type: e.target.value })}>
                            <option value="hex">{__('messages.brand_swatch_hex')}</option>
                            <option value="image">{__('messages.brand_swatch_image')}</option>
                        </select>
                    </div>
                    <div className="mb-2">
                        <label className="small fw-bold text-primary">{__('messages.brand_swatch_value')}</label>
                        {editData.type === 'image' ? (
                            <>
                                <input type="file" className={`form-control form-control-sm ${editErrors.value ? 'is-invalid' : ''}`} onChange={(e) => onEditValueChange(swatch.id, e)} accept="image/jpeg,image/png,image.webp" />
                                {previewUrls[swatch.id] && <img src={previewUrls[swatch.id]} alt="preview" className="mt-1" style={{height:'2rem'}} />}
                                {!previewUrls[swatch.id] && swatch.image_url && <img src={swatch.image_url} alt={swatch.name} className="mt-1" style={{height:'2rem'}} />}
                                {editErrors.value && <div className="invalid-feedback d-block">{editErrors.value}</div>}
                            </>
                        ) : (
                            <>
                                <input type="text" className={`form-control form-control-sm ${editErrors.value ? 'is-invalid' : ''}`} value={editData.value} onChange={(e) => onEditDataChange({ ...editData, value: e.target.value })} />
                                {editErrors.value && <div className="invalid-feedback d-block">{editErrors.value}</div>}
                            </>
                        )}
                    </div>
                    <div className="d-flex gap-1 mt-2">
                        <button className="btn btn-success btn-sm" onClick={() => onSaveEdit(swatch.id)} disabled={processingEdit}>{__('messages.admin_save')}</button>
                        <button className="btn btn-secondary btn-sm" onClick={onCancelEdit}>{__('messages.button_cancel')}</button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="d-flex align-items-start gap-3 mb-2">
                        {swatch.type === 'hex' ? (
                            <>
                                <div className="swatch-swatch flex-shrink-0" style={{ backgroundColor: swatch.value }} />
                                <span className="font-monospace small text-muted">{swatch.value}</span>
                            </>
                        ) : swatch.image_url ? (
                            <img src={swatch.image_url} alt={swatch.name} className="swatch-thumb flex-shrink-0" />
                        ) : (
                            <div className="swatch-swatch flex-shrink-0" style={{ backgroundColor: '#f3f4f6' }} />
                        )}
                    </div>
                    <div className="mb-2">
                        <div className="fw-semibold small text-truncate">{swatch.name}</div>
                        <div className="text-muted small text-truncate">{swatch.product_name || '-'}</div>
                        <span className={`badge badge-${swatch.type === 'hex' ? 'primary' : 'info'} mt-1`}>{swatch.type}</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-between pt-2 border-top">
                        <div className="d-flex gap-1">
                            <button className="btn btn-outline-primary btn-sm" title={__('messages.admin_edit')} onClick={() => onStartEdit(swatch)}>
                                <i className="fas fa-pen"></i>
                            </button>
                            <button className="btn btn-outline-danger btn-sm" title={__('messages.admin_delete')} onClick={() => onDelete(swatch.id)}>
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                        <span className="drag-handle d-inline-block" {...attributes} {...listeners} title="Drag to reorder">
                            <i className="fas fa-grip-vertical"></i>
                        </span>
                    </div>
                </>
            )}
        </div>
    );
}

export default function SwatchesIndex() {
    const { __ } = useTranslation();
    const { swatches: initialSwatches, products, totalSwatches, filters = {} } = usePage().props;
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ name: '', product_id: '', type: 'hex', value: '' });
    const [editErrors, setEditErrors] = useState({});
    const [processingEdit, setProcessingEdit] = useState(false);
    const [previewUrls, setPreviewUrls] = useState({});
    const [createPreviewUrl, setCreatePreviewUrl] = useState(null);

    const [filterProduct, setFilterProduct] = useState(filters.product_id || '');
    const [filterType, setFilterType] = useState(filters.type || '');
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const [loadedSwatches, setLoadedSwatches] = useState(initialSwatches || []);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const offsetRef = useRef((initialSwatches || []).length);

    const sentinelRef = useRef(null);

    const { data, setData, post, processing, errors, reset } = useForm({ name: '', product_id: '', type: 'hex', value: '' });

    function handleCreate(e) {
        e.preventDefault();
        post(route('admin.swatches.store'), {
            onSuccess: () => {
                reset();
                document.querySelector('[data-bs-dismiss="offcanvas"]')?.click();
            },
        });
    }

    function startEdit(k) {
        setEditingId(k.id);
        setEditData({ name: k.name, product_id: k.product_id || '', type: k.type, value: k.value });
    }

    function cancelEdit() { setEditingId(null); }

    function saveEdit(id) {
        setProcessingEdit(true);
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('name', editData.name);
        formData.append('product_id', editData.product_id);
        formData.append('type', editData.type);
        if (editData.type === 'image' && editData.value instanceof File) {
            formData.append('value', editData.value);
        } else if (editData.type === 'hex') {
            formData.append('value', editData.value);
        }
        router.post(route('admin.swatches.update', id), formData, {
            onSuccess: () => { cancelEdit(); setEditErrors({}); setProcessingEdit(false); },
            onError: (errors) => { setEditErrors(errors || {}); setProcessingEdit(false); },
            onFinish: () => null,
        });
    }

    function handleDelete(id) {
        if (confirm(__('messages.ui_confirm'))) router.delete(route('admin.swatches.destroy', id));
    }

    function handleEditValueChange(id, e) {
        const file = e.target.files?.[0];
        if (file) {
            setEditData((prev) => ({ ...prev, value: file }));
            if (previewUrls[id]) URL.revokeObjectURL(previewUrls[id]);
            setPreviewUrls((prev) => ({ ...prev, [id]: URL.createObjectURL(file) }));
        }
    }

    function applyFilters() {
        const params = {};
        if (filterProduct) params.product_id = filterProduct;
        if (filterType) params.type = filterType;
        if (searchTerm.trim()) params.search = searchTerm.trim();
        router.get(route('admin.swatches.index'), params, {
            preserveState: false,
            preserveScroll: true,
        });
    }

    function clearFilters() {
        setFilterProduct('');
        setFilterType('');
        setSearchTerm('');
        router.get(route('admin.swatches.index'), {}, {
            preserveState: false,
            preserveScroll: true,
        });
    }

    const hasActiveFilters = filterProduct || filterType || searchTerm.trim();

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    function handleDragEnd(event) {
        if (editingId) return;
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        setLoadedSwatches((prev) => {
            const oldIndex = prev.findIndex((k) => k.id === active.id);
            const newIndex = prev.findIndex((k) => k.id === over.id);
            if (oldIndex === -1 || newIndex === -1) return prev;

            const reordered = arrayMove(prev, oldIndex, newIndex);
            const order = reordered.map((k, i) => ({ id: k.id, position: i }));

            axios.post(route('admin.swatches.reorder'), { order }).catch(() => {});

            return reordered;
        });
    }

    const loadMore = useCallback(async () => {
        if (loadingMore || !hasMore) return;
        setLoadingMore(true);
        try {
            const params = { offset: offsetRef.current };
            if (filterProduct) params.product_id = filterProduct;
            if (filterType) params.type = filterType;
            if (searchTerm.trim()) params.search = searchTerm.trim();
            const response = await axios.get(route('admin.swatches.load-more', params));
            const { swatches: newSwatches, hasMore: more } = response.data;
            setLoadedSwatches((prev) => [...prev, ...newSwatches]);
            offsetRef.current += newSwatches.length;
            setHasMore(more);
        } catch {
            // ignore
        } finally {
            setLoadingMore(false);
        }
    }, [loadingMore, hasMore, filterProduct, filterType, searchTerm]);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) loadMore();
            },
            { rootMargin: '200px' }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [loadMore]);

    const sortableIds = useMemo(() => loadedSwatches.map((k) => k.id), [loadedSwatches]);

    return (
        <RootLayout>
            <Head title={__('messages.admin_swatches')} />
            <div className="container-fluid">
                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">{__('messages.admin_swatches')}</h1>
                    <button
                        className="btn btn-primary btn-sm"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#swatchOffcanvas"
                        aria-controls="swatchOffcanvas"
                    >
                        <i className="fas fa-plus me-1"></i>
                        {__('messages.brand_add_swatch')}
                    </button>
                </div>

                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <div className="row g-2 align-items-end">
                            <div className="col-md-4">
                                <label className="small fw-bold text-primary">{__('messages.brand_product_name')}</label>
                                <select className="form-select form-select-sm" value={filterProduct} onChange={(e) => setFilterProduct(e.target.value)}>
                                    <option value="">--</option>
                                    {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="small fw-bold text-primary">{__('messages.brand_swatch_type')}</label>
                                <select className="form-select form-select-sm" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                                    <option value="">--</option>
                                    <option value="hex">{__('messages.brand_swatch_hex')}</option>
                                    <option value="image">{__('messages.brand_swatch_image')}</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="small fw-bold text-primary">{__('messages.admin_search_placeholder')}</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder={__('messages.admin_search_placeholder')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
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
                        {loadedSwatches.length === 0 ? (
                            <div className="text-center text-muted py-4">
                                {hasActiveFilters ? __('messages.ui_no_results') : __('messages.admin_no_swatches')}
                            </div>
                        ) : (
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
                                    <div className="swatch-grid">
                                        {loadedSwatches.map((k) => (
                                            <SortableSwatchCard
                                                key={k.id}
                                                swatch={k}
                                                isEditing={editingId === k.id}
                                                editData={editData}
                                                editErrors={editErrors}
                                                onStartEdit={startEdit}
                                                onSaveEdit={saveEdit}
                                                onCancelEdit={cancelEdit}
                                                onDelete={handleDelete}
                                                onEditDataChange={setEditData}
                                                onEditValueChange={handleEditValueChange}
                                                previewUrls={previewUrls}
                                                products={products}
                                                __={__}
                                                processingEdit={processingEdit}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>
                        )}

                        {hasMore && (
                            <>
                                <div ref={sentinelRef} className="infinite-scroll-sentinel" />
                                {loadingMore && (
                                    <div className="text-center py-3">
                                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="offcanvas offcanvas-end" tabIndex="-1" id="swatchOffcanvas" aria-labelledby="swatchOffcanvasLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="swatchOffcanvasLabel">{__('messages.brand_add_swatch')}</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <form onSubmit={handleCreate}>
                        <div className="mb-3">
                            <label className="small font-weight-bold text-primary">{__('messages.brand_swatch_name')}</label>
                            <input type="text" className={`form-control form-control-sm ${errors.name ? 'is-invalid' : ''}`} value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="small font-weight-bold text-primary">{__('messages.brand_product_name')}</label>
                            <select className={`form-select form-select-sm ${errors.product_id ? 'is-invalid' : ''}`} value={data.product_id} onChange={(e) => setData('product_id', e.target.value)}>
                                <option value="">--</option>
                                {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                            {errors.product_id && <div className="invalid-feedback">{errors.product_id}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="small font-weight-bold text-primary">{__('messages.brand_swatch_type')}</label>
                            <select className="form-select form-select-sm" value={data.type} onChange={(e) => setData('type', e.target.value)}>
                                <option value="hex">{__('messages.brand_swatch_hex')}</option>
                                <option value="image">{__('messages.brand_swatch_image')}</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="small font-weight-bold text-primary">{__('messages.brand_swatch_value')}</label>
                            {data.type === 'image' ? (
                                <>
                                    <input type="file" className={`form-control form-control-sm ${errors.value ? 'is-invalid' : ''}`}
                                           onChange={(e) => {
                                               const file = e.target.files[0];
                                               setData('value', file);
                                               if (createPreviewUrl) URL.revokeObjectURL(createPreviewUrl);
                                               if (file) setCreatePreviewUrl(URL.createObjectURL(file));
                                               else setCreatePreviewUrl(null);
                                           }}
                                           accept="image/jpeg,image/png,image.webp" />
                                    {createPreviewUrl && <img src={createPreviewUrl} alt="preview" className="mt-2 border rounded" style={{height:'3rem'}} />}
                                    {errors.value && <div className="invalid-feedback">{errors.value}</div>}
                                </>
                            ) : (
                                <>
                                    <input type="text" className={`form-control form-control-sm ${errors.value ? 'is-invalid' : ''}`} placeholder="#FF5733" value={data.value} onChange={(e) => setData('value', e.target.value)} />
                                    {errors.value && <div className="invalid-feedback">{errors.value}</div>}
                                </>
                            )}
                        </div>
                        <button type="submit" className="btn btn-primary w-100" disabled={processing}>
                            {processing ? __('messages.ui_processing') : __('messages.brand_add_swatch')}
                        </button>
                    </form>
                </div>
            </div>
        </RootLayout>
    );
}
