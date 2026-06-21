import { Head, Link } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';

const statusOrder = ['pending', 'processing', 'completed', 'failed'];

export default function SubmissionShow({ submission }) {
    const { __ } = useTranslation();

    const statusConfig = {
        pending: { label: __('messages.admin_status_pending'), color: 'bg-warning bg-opacity-25 text-warning', dot: 'bg-warning' },
        processing: { label: __('messages.admin_status_processing'), color: 'bg-info bg-opacity-25 text-info', dot: 'bg-info' },
        completed: { label: __('messages.admin_status_completed'), color: 'bg-success bg-opacity-25 text-success', dot: 'bg-success' },
        failed: { label: __('messages.admin_status_failed'), color: 'bg-danger bg-opacity-25 text-danger', dot: 'bg-danger' },
    };

    const currentStatusIndex = statusOrder.indexOf(submission.status);

    return (
        <>
            <Head title={__('messages.admin_submission_for', { name: submission.name })} />

            <div className="mx-auto" style={{ maxWidth: '80rem' }}>
                <nav className="mb-4">
                    <Link href="/admin/submissions" className="small text-primary text-decoration-none">
                        &larr; {__('messages.admin_back_to_submissions')}
                    </Link>
                </nav>

                <h1 className="fs-3 fw-semibold text-body mb-4">
                    {__('messages.admin_submission_for', { name: submission.name })}
                </h1>

                <div className="row g-4 mb-5">
                    <div className="col-lg-8 bg-white rounded-4 border border-secondary shadow-sm p-4">
                        <h2 className="fs-5 fw-semibold text-body mb-3">{__('messages.admin_details')}</h2>
                        <dl className="row g-3 mb-0">
                            <div className="col-12">
                                <dt className="small fw-medium text-secondary text-uppercase mb-0">{__('messages.admin_uuid')}</dt>
                                <dd className="small text-body font-monospace mt-1 mb-0">{submission.uuid}</dd>
                            </div>
                            <div className="col-sm-6">
                                <dt className="small fw-medium text-secondary text-uppercase mb-0">{__('messages.admin_name')}</dt>
                                <dd className="small text-body mt-1 mb-0">{submission.name}</dd>
                            </div>
                            <div className="col-sm-6">
                                <dt className="small fw-medium text-secondary text-uppercase mb-0">{__('messages.admin_phone')}</dt>
                                <dd className="small text-body mt-1 mb-0">{submission.phone}</dd>
                            </div>
                            <div className="col-sm-6">
                                <dt className="small fw-medium text-secondary text-uppercase mb-0">{__('messages.admin_email')}</dt>
                                <dd className="small text-body mt-1 mb-0">{submission.email}</dd>
                            </div>
                            <div className="col-sm-6">
                                <dt className="small fw-medium text-secondary text-uppercase mb-0">{__('messages.admin_city')}</dt>
                                <dd className="small text-body mt-1 mb-0">{submission.city}</dd>
                            </div>
                            <div className="col-sm-6">
                                <dt className="small fw-medium text-secondary text-uppercase mb-0">{__('messages.admin_surface')}</dt>
                                <dd className="small text-body mt-1 mb-0">{submission.surface}</dd>
                            </div>
                            <div className="col-sm-6">
                                <dt className="small fw-medium text-secondary text-uppercase mb-0">{__('messages.admin_status')}</dt>
                                <dd className="mt-1 mb-0">
                                    <span className={`d-inline-flex align-items-center px-2 py-1 rounded-pill small fw-medium ${statusConfig[submission.status]?.color || 'bg-light text-secondary'}`}>
                                        {statusConfig[submission.status]?.label || submission.status}
                                    </span>
                                </dd>
                            </div>
                            {submission.prompt && (
                                <div className="col-12">
                                    <dt className="small fw-medium text-secondary text-uppercase mb-0">{__('messages.admin_prompt')}</dt>
                                    <dd className="small text-body bg-light rounded-3 p-3 mt-1 mb-0" style={{ whiteSpace: 'pre-wrap' }}>{submission.prompt}</dd>
                                </div>
                            )}
                            <div className="col-sm-6">
                                <dt className="small fw-medium text-secondary text-uppercase mb-0">{__('messages.admin_created')}</dt>
                                <dd className="small text-body mt-1 mb-0">{new Date(submission.created_at).toLocaleString()}</dd>
                            </div>
                            <div className="col-sm-6">
                                <dt className="small fw-medium text-secondary text-uppercase mb-0">{__('messages.admin_updated')}</dt>
                                <dd className="small text-body mt-1 mb-0">{new Date(submission.updated_at).toLocaleString()}</dd>
                            </div>
                        </dl>
                    </div>

                    <div className="col-lg-4 bg-white rounded-4 border border-secondary shadow-sm p-4">
                        <h2 className="fs-5 fw-semibold text-body mb-3">{__('messages.admin_status_timeline')}</h2>
                        <div className="position-relative">
                            {statusOrder.map((status, index) => {
                                const config = statusConfig[status];
                                const isPast = index <= currentStatusIndex;
                                const isCurrent = index === currentStatusIndex;

                                return (
                                    <div key={status} className="d-flex align-items-start gap-3 pb-4 position-relative" style={index === statusOrder.length - 1 ? { paddingBottom: 0 } : {}}>
                                        {index < statusOrder.length - 1 && (
                                            <div className={`position-absolute top-0 w-0 h-100 ${index < currentStatusIndex ? 'bg-success' : 'bg-secondary'}`} style={{ left: '11px', width: '2px', zIndex: 0 }} />
                                        )}
                                        <div className={`position-relative d-flex align-items-center justify-content-center rounded-circle ${isPast ? (config?.dot || 'bg-secondary') : 'bg-secondary'}`}
                                            style={{ width: '1.5rem', height: '1.5rem', marginTop: '0.25rem', zIndex: 1, boxShadow: isCurrent ? '0 0 0 2px #fff, 0 0 0 4px var(--bs-info)' : 'none' }}
                                        >
                                            {isPast && index < currentStatusIndex && (
                                                <svg style={{ width: '0.75rem', height: '0.75rem' }} className="text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="flex-grow-1 overflow-hidden">
                                            <p className={`small fw-medium mb-0 ${isPast ? 'text-body' : 'text-secondary'}`}>
                                                {config?.label || status}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {submission.images && submission.images.length > 0 && (
                    <div className="bg-white rounded-4 border border-secondary shadow-sm p-4">
                        <h2 className="fs-5 fw-semibold text-body mb-4">{__('messages.admin_images')}</h2>
                        <div className="row row-cols-1 row-cols-md-2 g-4">
                            {submission.images.map((image) => (
                                <div key={image.id} className="d-flex flex-column gap-2">
                                    <div>
                                        <h3 className="small fw-medium text-secondary mb-2">{__('messages.admin_original')}</h3>
                                        <div className="bg-light rounded-3 overflow-hidden border border-secondary" style={{ aspectRatio: '1 / 1' }}>
                                            <img src={`/img/${image.id}?variant=original`} alt={__('messages.admin_original')} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="small fw-medium text-secondary mb-2">{__('messages.admin_generated')}</h3>
                                        {image.generated_image ? (
                                            <div className="bg-light rounded-3 overflow-hidden border border-secondary" style={{ aspectRatio: '1 / 1' }}>
                                                <img src={`/img/${image.id}?variant=generated`} alt={__('messages.admin_generated')} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                                            </div>
                                        ) : (
                                            <div className="bg-light rounded-3 border border-dashed border-secondary d-flex align-items-center justify-content-center" style={{ aspectRatio: '1 / 1' }}>
                                                <p className="small text-secondary mb-0">
                                                    {submission.status === 'processing' ? __('messages.admin_generating') : __('messages.admin_not_available')}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
