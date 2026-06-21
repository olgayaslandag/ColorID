import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export default function PalettesIndex({ paletteGroups }) {
    const { __ } = useTranslation();

    const [expandedGroups, setExpandedGroups] = useState(() => {
        const initial = {};
        paletteGroups.forEach((group) => {
            initial[group.id] = true;
        });
        return initial;
    });

    const toggleGroup = (id) => {
        setExpandedGroups((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <>
            <Head title={__('messages.admin_palettes')} />

            <div className="mx-auto" style={{ maxWidth: '80rem' }}>
                <h1 className="fs-3 fw-semibold text-body mb-4">{__('messages.admin_color_palettes')}</h1>

                {paletteGroups.length === 0 ? (
                    <div className="bg-white rounded-4 border border-secondary shadow-sm p-5 text-center">
                        <p className="text-secondary mb-0">{__('messages.admin_no_palette_groups')}</p>
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-3">
                        {paletteGroups.map((group) => (
                            <div key={group.id} className="bg-white rounded-4 border border-secondary shadow-sm overflow-hidden">
                                <button
                                    onClick={() => toggleGroup(group.id)}
                                    className="w-100 d-flex align-items-center justify-content-between px-4 py-3 transition btn btn-light text-start border-0 rounded-0"
                                >
                                    <h2 className="fs-5 fw-semibold text-body mb-0">{group.title}</h2>
                                    <svg
                                        className={`text-secondary transition ${expandedGroups[group.id] ? 'rotate-180' : ''}`}
                                        style={{ width: '1.25rem', height: '1.25rem' }}
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {expandedGroups[group.id] && (
                                    <div className="px-4 pb-4">
                                        {group.palettes.length === 0 ? (
                                            <p className="small text-secondary py-3 mb-0">{__('messages.admin_no_palettes_in_group')}</p>
                                        ) : (
                                            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3 mt-3">
                                                {group.palettes.map((palette) => (
                                                    <div key={palette.id} className="border border-secondary rounded-3 overflow-hidden transition shadow-sm">
                                                        <div className="w-100" style={{ height: '6rem', backgroundColor: palette.color_code }} />
                                                        <div className="p-3">
                                                            <p className="small fw-medium text-body text-truncate mb-0">{palette.title}</p>
                                                            <p className="small text-secondary font-monospace mt-1 mb-0">{palette.color_code}</p>
                                                            {palette.image && (
                                                                <img src={`/storage/${palette.image}`} alt={palette.title} className="mt-2 w-100 rounded-2" style={{ height: '4rem', objectFit: 'cover' }} />
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
