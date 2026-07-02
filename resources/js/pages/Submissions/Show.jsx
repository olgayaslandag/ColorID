import { Head, Link, router } from '@inertiajs/react';
import RootLayout from '@/layouts/RootLayout';
import { useTranslation } from '@/hooks/useTranslation';

const statusOrder = ['pending', 'processing', 'completed', 'failed'];

export default function SubmissionShow({ submission }) {
    const { __ } = useTranslation();

    const statusConfig = {
        pending: { label: __('messages.admin_status_pending'), color: 'badge badge-warning', dot: 'bg-warning' },
        processing: { label: __('messages.admin_status_processing'), color: 'badge badge-info', dot: 'bg-info' },
        completed: { label: __('messages.admin_status_completed'), color: 'badge badge-success', dot: 'bg-success' },
        failed: { label: __('messages.admin_status_failed'), color: 'badge badge-danger', dot: 'bg-danger' },
    };

    const currentStatusIndex = statusOrder.indexOf(submission.status);

    const deleteSubmission = () => {
        if (!confirm(__('messages.admin_confirm_delete_submission'))) return;
        router.delete(route('admin.submissions.destroy', submission.uuid));
    };

    return (
        <RootLayout>
            <Head title={__('messages.admin_submission_for', { name: submission.name })} />

            <div className="container-fluid">
                {/* Page Heading */}
                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">{__('messages.admin_submission_for', { name: submission.name })}</h1>
                    <div>
                        <Link href={route('admin.submissions.index')} className="btn btn-outline-secondary btn-sm mr-2">
                            &larr; {__('messages.admin_back_to_submissions')}
                        </Link>
                        <button onClick={deleteSubmission} className="btn btn-danger btn-sm">
                            {__('messages.admin_delete')}
                        </button>
                    </div>
                </div>

                <div className="row">
                    {/* Submission Details Card */}
                    <div className="col-lg-8 mb-4">
                        <div className="card shadow mb-4">
                            <div className="card-header py-3">
                                <h6 className="m-0 font-weight-bold text-primary">{__('messages.admin_details')}</h6>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-12 mb-3">
                                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">{__('messages.admin_uuid')}</div>
                                        <p className="mb-0 font-monospace text-gray-800">{submission.uuid}</p>
                                    </div>
                                    <div className="col-sm-6 mb-3">
                                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">{__('messages.admin_name')}</div>
                                        <p className="mb-0 font-weight-bold text-gray-800">{submission.name}</p>
                                    </div>
                                    <div className="col-sm-6 mb-3">
                                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">{__('messages.admin_phone')}</div>
                                        <p className="mb-0 text-gray-800">{submission.phone}</p>
                                    </div>
                                    <div className="col-sm-6 mb-3">
                                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">{__('messages.admin_email')}</div>
                                        <p className="mb-0 text-gray-800">{submission.email}</p>
                                    </div>
                                    <div className="col-sm-6 mb-3">
                                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">{__('messages.admin_city')}</div>
                                        <p className="mb-0 text-gray-800">{submission.city}</p>
                                    </div>
                                    <div className="col-sm-6 mb-3">
                                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">{__('messages.admin_surface')}</div>
                                        <p className="mb-0 text-gray-800">{submission.surface}</p>
                                    </div>
                                    <div className="col-sm-6 mb-3">
                                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">{__('messages.admin_status')}</div>
                                        <span className={statusConfig[submission.status]?.color || 'badge badge-secondary'}>
                                            {statusConfig[submission.status]?.label || submission.status}
                                        </span>
                                    </div>
                                    {submission.prompt && (
                                        <div className="col-12 mb-3">
                                            <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">{__('messages.admin_prompt')}</div>
                                            <p className="mb-0 bg-light p-3 rounded text-gray-800" style={{ whiteSpace: 'pre-wrap' }}>{submission.prompt}</p>
                                        </div>
                                    )}
                                    <div className="col-sm-6 mb-3">
                                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">{__('messages.admin_created')}</div>
                                        <p className="mb-0 text-gray-800">{new Date(submission.created_at).toLocaleString()}</p>
                                    </div>
                                    <div className="col-sm-6 mb-3">
                                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">{__('messages.admin_updated')}</div>
                                        <p className="mb-0 text-gray-800">{new Date(submission.updated_at).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Timeline Card */}
                    <div className="col-lg-4 mb-4">
                        <div className="card shadow mb-4">
                            <div className="card-header py-3">
                                <h6 className="m-0 font-weight-bold text-primary">{__('messages.admin_status_timeline')}</h6>
                            </div>
                            <div className="card-body">
                                <div className="position-relative">
                                    {statusOrder.map((status, index) => {
                                        const config = statusConfig[status];
                                        const isPast = index <= currentStatusIndex;
                                        const isCurrent = index === currentStatusIndex;

                                        return (
                                            <div key={status} className="d-flex align-items-start gap-3 pb-4 position-relative" style={index === statusOrder.length - 1 ? { paddingBottom: 0 } : {}}>
                                                {index < statusOrder.length - 1 && (
                                                    <div className={`position-absolute top-0 ${isPast ? 'bg-success' : 'bg-secondary'}`} style={{ left: '11px', width: '2px', height: '100%', zIndex: 0 }} />
                                                )}
                                                <div
                                                    className={`position-relative d-flex align-items-center justify-content-center rounded-circle ${isPast ? (config?.dot || 'bg-secondary') : 'bg-secondary'}`}
                                                    style={{ width: '1.5rem', height: '1.5rem', marginTop: '0.25rem', zIndex: 1, boxShadow: isCurrent ? '0 0 0 2px #fff, 0 0 0 4px #36b9cc' : 'none' }}
                                                >
                                                    {isPast && index < currentStatusIndex && (
                                                        <svg style={{ width: '0.75rem', height: '0.75rem' }} className="text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div className="flex-grow-1 overflow-hidden">
                                                    <p className={`small font-weight-bold mb-0 ${isPast ? 'text-gray-800' : 'text-secondary'}`}>
                                                        {config?.label || status}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Images Section */}
                {submission.images && submission.images.length > 0 && (
                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary">{__('messages.admin_images')}</h6>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                {submission.images.map((image) => (
                                    <div key={image.id} className="col-lg-6 mb-4">
                                        <div className="row no-gutters">
                                            <div className="col-md-6 mb-3 mb-md-0 pr-md-2">
                                                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">{__('messages.admin_original')}</div>
                                                <div className="bg-light rounded border" style={{ aspectRatio: '1 / 1' }}>
                                                    <img src={`/img/submissions/${image.id}?variant=original`} alt={__('messages.admin_original')} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                                                </div>
                                            </div>
                                            <div className="col-md-6 pl-md-2">
                                                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">{__('messages.admin_generated')}</div>
                                                {image.generated_image ? (
                                                    <div className="bg-light rounded border" style={{ aspectRatio: '1 / 1' }}>
                                                        <img src={`/img/submissions/${image.id}?variant=generated`} alt={__('messages.admin_generated')} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                                                    </div>
                                                ) : (
                                                    <div className="bg-light rounded border d-flex align-items-center justify-content-center" style={{ aspectRatio: '1 / 1' }}>
                                                        <p className="small text-secondary mb-0">
                                                            {submission.status === 'processing' ? __('messages.admin_generating') : __('messages.admin_not_available')}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </RootLayout>
    );
}
