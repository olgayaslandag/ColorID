import { Head, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import RootLayout from '@/layouts/RootLayout';
import { useTranslation } from '@/hooks/useTranslation';

export default function WidgetDemo() {
    const { __ } = useTranslation();
    const { tenant } = usePage().props;
    const [showCode, setShowCode] = useState(true);
    const [copied, setCopied] = useState(false);

    const primaryColor = tenant?.primary_color ?? '#4F46E5';
    const widgetUrl = `${window.location.origin}/widget.js`;

    const embedCode = useMemo(() => {
        return `<!-- Photo Builder Widget -->\n<div id="photo_builder"></div>\n<script src="${widgetUrl}"></script>`;
    }, [widgetUrl]);

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(embedCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            const textarea = document.createElement('textarea');
            textarea.value = embedCode;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <RootLayout>
            <Head title={__('messages.admin_widget_demo_title')} />

            <div className="container-fluid">
                {/* Page Heading */}
                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <div>
                        <h1 className="h3 mb-0 text-gray-800">{__('messages.admin_widget_demo_title')}</h1>
                        <p className="small text-secondary mt-1 mb-0">{__('messages.admin_widget_demo_description')}</p>
                    </div>
                </div>

                {/* Embed Code Card */}
                <div className="card shadow mb-4">
                    <div className="card-header py-3 d-flex align-items-center justify-content-between">
                        <h6 className="m-0 font-weight-bold text-primary">{__('messages.admin_embed_code')}</h6>
                        <button
                            onClick={() => setShowCode(!showCode)}
                            className="btn btn-link btn-sm text-decoration-none p-0"
                        >
                            {showCode ? __('messages.admin_hide_code') : __('messages.admin_show_code')}
                        </button>
                    </div>

                    {showCode && (
                        <div className="card-body">
                            <div className="bg-dark rounded p-3 overflow-x-auto mb-3">
                                <pre className="small text-success mb-0" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                                    {embedCode}
                                </pre>
                            </div>
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="small text-secondary">
                                    <span className="font-weight-bold">{__('messages.admin_widget_url')}</span>{' '}
                                    <code className="bg-light px-2 py-0 rounded text-secondary small">{widgetUrl}</code>
                                </div>
                                <button
                                    onClick={handleCopyCode}
                                    className="btn btn-sm text-white"
                                    style={{
                                        backgroundColor: copied ? '#059669' : primaryColor,
                                    }}
                                >
                                    {copied ? (
                                        <>
                                            <svg style={{ width: '1rem', height: '1rem' }} className="mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {__('messages.admin_copied')}
                                        </>
                                    ) : (
                                        <>
                                            <svg style={{ width: '1rem', height: '1rem' }} className="mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                            {__('messages.admin_copy_code')}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Integration Instructions Card */}
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">{__('messages.admin_integration_instructions')}</h6>
                    </div>
                    <div className="card-body">
                        <div className="d-flex flex-column gap-4">
                            {[
                                { num: 1, title: __('messages.admin_step_1_title'), desc: __('messages.admin_step_1_desc'), code: '<div id="photo_builder"></div>' },
                                { num: 2, title: __('messages.admin_step_2_title'), desc: __('messages.admin_step_2_desc'), code: '</body>' },
                                { num: 3, title: __('messages.admin_step_3_title'), desc: __('messages.admin_step_3_desc') },
                            ].map((step) => (
                                <div key={step.num} className="d-flex gap-3">
                                    <span className="flex-shrink-0 rounded-circle d-flex align-items-center justify-content-center small font-weight-bold text-white"
                                        style={{ width: '2rem', height: '2rem', backgroundColor: primaryColor }}>
                                        {step.num}
                                    </span>
                                    <div>
                                        <h6 className="font-weight-bold text-gray-800 mb-1">{step.title}</h6>
                                        <p className="small text-secondary mb-0">
                                            {step.code ? (
                                                (() => {
                                                    const parts = step.desc.split(':code');
                                                    if (parts.length === 2) {
                                                        return <>{parts[0]}<code className="bg-light px-1 py-0 rounded small text-secondary">{step.code}</code>{parts[1]}</>;
                                                    }
                                                    return step.desc;
                                                })()
                                            ) : step.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Requirements Card */}
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">{__('messages.admin_requirements')}</h6>
                    </div>
                    <div className="card-body">
                        <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
                            {[
                                __('messages.admin_req_domain'),
                                __('messages.admin_req_vanilla_js'),
                                __('messages.admin_req_browsers'),
                                __('messages.admin_req_responsive'),
                            ].map((req, i) => (
                                <li key={i} className="d-flex align-items-start gap-3 small text-secondary">
                                    <svg style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0, marginTop: '0.125rem', color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{req}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Live Preview Card */}
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">{__('messages.admin_live_preview')}</h6>
                    </div>
                    <div className="card-body">
                        <div className="bg-light rounded p-3 border">
                            <div className="mb-3 d-flex align-items-center gap-2">
                                <span className="rounded-circle bg-danger d-inline-block" style={{ width: '0.75rem', height: '0.75rem' }} />
                                <span className="rounded-circle bg-warning d-inline-block" style={{ width: '0.75rem', height: '0.75rem' }} />
                                <span className="rounded-circle bg-success d-inline-block" style={{ width: '0.75rem', height: '0.75rem' }} />
                                <span className="small text-secondary ms-1">{__('messages.visualize_photo_builder')}</span>
                            </div>
                            <div id="photo_builder" className="bg-white rounded border shadow-sm mx-auto" style={{ maxWidth: '28rem' }} />
                        </div>
                        <p className="small text-secondary mt-3 mb-0">{__('messages.admin_preview_notice')}</p>
                    </div>
                </div>
            </div>
        </RootLayout>
    );
}
