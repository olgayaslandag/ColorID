import { Link, usePage, Head } from '@inertiajs/react';
import { useEffect, useMemo } from 'react';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { useTranslation } from '@/hooks/useTranslation';
import '../../css/admin.css';

export default function RootLayout({ children }) {
    const { __ } = useTranslation();
    const { auth, flash = {} } = usePage().props;

    useEffect(() => {
        async function loadDependencies() {
            const jQuery = (await import('jquery')).default;
            window.$ = window.jQuery = jQuery;

            await import('bootstrap/dist/js/bootstrap.bundle.min.js');
            await import('../../sbadmin/vendor/jquery-easing/jquery.easing.min.js');
            await import('@/vendor/sb-admin-2.min.js');
        }
        loadDependencies();
    }, []);

    // Flash messages derived from server-side flash data
    const flashMessages = useMemo(
        () =>
            [
                { type: 'success', message: flash.success },
                { type: 'error', message: flash.error },
                { type: 'warning', message: flash.warning },
                { type: 'info', message: flash.info },
            ].filter((f) => f.message),
        [flash]
    );

    // Helper: check if the current route matches a pattern
    // Supports wildcard patterns like 'admin.tenants.*' (ziggy glob matching)
    const isRouteActive = (pattern) => {
        try {
            return route().current(pattern);
        } catch (e) {
            return false;
        }
    };

    // Check if any product-related page is active (for the Ürünler collapse)
    const isProductsCollapseActive = () =>
        ['admin.categories.*', 'admin.products.*', 'admin.swatches.*'].some((p) => isRouteActive(p));

    return (
        <div id="wrapper">
            <Head title={__('messages.admin_title')}>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            {/* =========================================================== */}
            {/* Sidebar                                                  */}
            {/* =========================================================== */}
            <ul
                className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
                id="accordionSidebar"
            >
                {/* ---- Sidebar - Brand ---- */}
                <Link
                    className="sidebar-brand d-flex align-items-center justify-content-center"
                    href={route('admin.dashboard')}
                >
                    <div className="sidebar-brand-icon rotate-n-15">
                        <i className="fas fa-palette"></i>
                    </div>
                    <div className="sidebar-brand-text mx-3">ColorID</div>
                </Link>

                {/* ---- Divider ---- */}
                <hr className="sidebar-divider my-0" />

                {/* ---- Nav Item - Dashboard ---- */}
                <li className={`nav-item ${isRouteActive('admin.dashboard') ? 'active' : ''}`}>
                    <Link className="nav-link" href={route('admin.dashboard')}>
                        <i className="fas fa-fw fa-tachometer-alt"></i>
                        <span>{__('messages.dashboard_title')}</span>
                    </Link>
                </li>


                {/* ---- Divider ---- */}
                <hr className="sidebar-divider" />

                {/* ---- Nav Item - Tenants ---- */}
                <li className={`nav-item ${isRouteActive('admin.tenants.*') ? 'active' : ''}`}>
                    <Link className="nav-link" href={route('admin.tenants.index')}>
                        <i className="fas fa-fw fa-building"></i>
                        <span>{__('messages.admin_tenants')}</span>
                    </Link>
                </li>

                {/* ---- Divider ---- */}
                <hr className="sidebar-divider" />

                {/* ---- Nav Item - Ürünler (Products) Collapse ---- */}
                <li className={`nav-item ${isProductsCollapseActive() ? 'active' : ''}`}>
                    <a
                        className={`nav-link${!isProductsCollapseActive() ? ' collapsed' : ''}`}
                        href="#"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseProducts"
                        aria-expanded={isProductsCollapseActive() ? 'true' : 'false'}
                        aria-controls="collapseProducts"
                    >
                        <i className="fas fa-fw fa-box"></i>
                        <span>{__('messages.admin_products')}</span>
                    </a>
                    <div
                        id="collapseProducts"
                        className={`collapse${isProductsCollapseActive() ? ' show' : ''}`}
                        data-bs-parent="#accordionSidebar"
                    >
                        <div className="bg-white py-2 collapse-inner rounded">
                            <h6 className="collapse-header">
                                {__('messages.admin_products')}
                            </h6>
                            <Link
                                className={`collapse-item${isRouteActive('admin.categories.*') ? ' active' : ''}`}
                                href={route('admin.categories.index')}
                            >
                                <i className="fas fa-fw fa-layer-group mr-2"></i>
                                {__('messages.admin_categories')}
                            </Link>
                            <Link
                                className={`collapse-item${isRouteActive('admin.products.*') ? ' active' : ''}`}
                                href={route('admin.products.index')}
                            >
                                <i className="fas fa-fw fa-box mr-2"></i>
                                {__('messages.admin_products')}
                            </Link>
                            <Link
                                className={`collapse-item${isRouteActive('admin.swatches.*') ? ' active' : ''}`}
                                href={route('admin.swatches.index')}
                            >
                                <i className="fas fa-fw fa-swatchbook mr-2"></i>
                                {__('messages.admin_swatches')}
                            </Link>
                        </div>
                    </div>
                </li>


                {/* ---- Nav Item - Users ---- */}
                <li className={`nav-item ${isRouteActive('admin.users.*') ? 'active' : ''}`}>
                    <Link className="nav-link" href={route('admin.users.index')}>
                        <i className="fas fa-fw fa-users"></i>
                        <span>{__('messages.admin_users')}</span>
                    </Link>
                </li>

                {/* ---- Nav Item - Submissions ---- */}
                <li className={`nav-item ${isRouteActive('admin.submissions.*') ? 'active' : ''}`}>
                    <Link className="nav-link" href={route('admin.submissions.index')}>
                        <i className="fas fa-fw fa-file-alt"></i>
                        <span>{__('messages.admin_submissions')}</span>
                    </Link>
                </li>

                {/* ---- Divider ---- */}
                <hr className="sidebar-divider" />

                {/* ---- Nav Item - Quota ---- */}
                <li className={`nav-item ${isRouteActive('admin.quota') ? 'active' : ''}`}>
                    <Link className="nav-link" href={route('admin.quota')}>
                        <i className="fas fa-fw fa-chart-bar"></i>
                        <span>{__('messages.admin_quota')}</span>
                    </Link>
                </li>

                {/* ---- Nav Item - Activity Log ---- */}
                <li className={`nav-item ${isRouteActive('admin.activity-log') ? 'active' : ''}`}>
                    <Link className="nav-link" href={route('admin.activity-log')}>
                        <i className="fas fa-fw fa-list"></i>
                        <span>{__('messages.admin_activity_log')}</span>
                    </Link>
                </li>

                {/* ---- Divider ---- */}
                <hr className="sidebar-divider" />

                {/* ---- Nav Item - Webhooks ---- */}
                <li className={`nav-item ${isRouteActive('admin.webhooks.*') ? 'active' : ''}`}>
                    <Link className="nav-link" href={route('admin.webhooks.index')}>
                        <i className="fas fa-fw fa-link"></i>
                        <span>{__('messages.admin_webhooks')}</span>
                    </Link>
                </li>

                {/* ---- Nav Item - Cache ---- */}
                <li className={`nav-item ${isRouteActive('admin.cache') ? 'active' : ''}`}>
                    <Link className="nav-link" href={route('admin.cache')}>
                        <i className="fas fa-fw fa-server"></i>
                        <span>{__('messages.admin_cache')}</span>
                    </Link>
                </li>

                {/* ---- Divider ---- */}
                <hr className="sidebar-divider d-none d-md-block" />

                {/* ---- Sidebar Toggler ---- */}
                <div className="text-center d-none d-md-inline">
                    <button className="rounded-circle border-0" id="sidebarToggle"></button>
                </div>

                {/* ---- Sidebar Card ---- */}
                <div className="sidebar-card d-none d-lg-flex">
                    <p className="text-center mb-2">
                        <strong>{__('messages.sidebar_card_title')}</strong>
                    </p>
                    <Link className="btn btn-success btn-sm" href={route('welcome')}>
                        {__('messages.nav_back_to_site')}
                    </Link>
                </div>
            </ul>
            {/* ======= End of Sidebar ======= */}

            {/* =========================================================== */}
            {/* Content Wrapper                                            */}
            {/* =========================================================== */}
            <div id="content-wrapper" className="d-flex flex-column">
                {/* ---- Main Content ---- */}
                <div id="content">
                    {/* ---- Topbar ---- */}
                    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                        {/* Sidebar Toggle (Topbar) */}
                        <button
                            id="sidebarToggleTop"
                            className="btn btn-link d-md-none rounded-circle mr-3"
                        >
                            <i className="fa fa-bars"></i>
                        </button>

                        {/* Topbar Search */}
                        <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control bg-light border-0 small"
                                    placeholder={__('messages.search_placeholder')}
                                    aria-label="Search"
                                    aria-describedby="basic-addon2"
                                />
                                <div className="input-group-append">
                                    <button className="btn btn-primary" type="button">
                                        <i className="fas fa-search fa-sm"></i>
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* Topbar Navbar */}
                        <ul className="navbar-nav ml-auto">
                            {/* ---- Flash Messages ---- */}
                            {flashMessages.map((flash, i) => {
                                const badgeClass = {
                                    success: 'badge-success',
                                    error: 'badge-danger',
                                    warning: 'badge-warning',
                                    info: 'badge-info',
                                }[flash.type];
                                return (
                                    <li
                                        key={i}
                                        className="nav-item d-flex align-items-center mx-1"
                                    >
                                        <span className={`badge ${badgeClass} p-2`}>
                                            {flash.message}
                                        </span>
                                    </li>
                                );
                            })}

                            {/* ---- Language Switcher ---- */}
                            <li className="nav-item d-flex align-items-center mx-1">
                                <LanguageSwitcher />
                            </li>

                            {/* ---- Nav Item - Search Dropdown (Visible Only XS) ---- */}
                            <li className="nav-item dropdown no-arrow d-sm-none">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    id="searchDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    <i className="fas fa-search fa-fw"></i>
                                </a>
                                <div
                                    className="dropdown-menu dropdown-menu-end p-3 shadow animated--grow-in"
                                    aria-labelledby="searchDropdown"
                                >
                                    <form className="form-inline mr-auto w-100 navbar-search">
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control bg-light border-0 small"
                                                placeholder={__('messages.search_placeholder')}
                                                aria-label="Search"
                                                aria-describedby="basic-addon2"
                                            />
                                            <div className="input-group-append">
                                                <button className="btn btn-primary" type="button">
                                                    <i className="fas fa-search fa-sm"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </li>

                            {/* ---- Nav Item - Alerts ---- */}
                            <li className="nav-item dropdown no-arrow mx-1">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    id="alertsDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    <i className="fas fa-bell fa-fw"></i>
                                    {/* Counter - Alerts */}
                                    <span className="badge badge-danger badge-counter">3+</span>
                                </a>
                                {/* Dropdown - Alerts */}
                                <div
                                    className="dropdown-list dropdown-menu dropdown-menu-end shadow animated--grow-in"
                                    aria-labelledby="alertsDropdown"
                                >
                                    <h6 className="dropdown-header">
                                        {__('messages.alerts_center')}
                                    </h6>
                                    <a className="dropdown-item d-flex align-items-center" href="#">
                                        <div className="mr-3">
                                            <div className="icon-circle bg-primary">
                                                <i className="fas fa-file-alt text-white"></i>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="small text-gray-500">
                                                {new Date().toLocaleDateString()}
                                            </div>
                                            <span className="font-weight-bold">
                                                {__('messages.sample_alert')}
                                            </span>
                                        </div>
                                    </a>
                                    <a className="dropdown-item text-center small text-gray-500" href="#">
                                        {__('messages.show_all_alerts')}
                                    </a>
                                </div>
                            </li>

                            {/* ---- Nav Item - Messages ---- */}
                            <li className="nav-item dropdown no-arrow mx-1">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    id="messagesDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    <i className="fas fa-envelope fa-fw"></i>
                                    {/* Counter - Messages */}
                                    <span className="badge badge-danger badge-counter">7</span>
                                </a>
                                {/* Dropdown - Messages */}
                                <div
                                    className="dropdown-list dropdown-menu dropdown-menu-end shadow animated--grow-in"
                                    aria-labelledby="messagesDropdown"
                                >
                                    <h6 className="dropdown-header">
                                        {__('messages.message_center')}
                                    </h6>
                                    <a className="dropdown-item d-flex align-items-center" href="#">
                                        <div className="dropdown-list-image mr-3">
                                            <img
                                                className="rounded-circle"
                                                src="https://ui-avatars.com/api/?name=User&background=4e73df&color=fff&size=60"
                                                alt="..."
                                            />
                                            <div className="status-indicator bg-success"></div>
                                        </div>
                                        <div className="font-weight-bold">
                                            <div className="text-truncate">
                                                {__('messages.sample_message')}
                                            </div>
                                            <div className="small text-gray-500">
                                                {__('messages.user')} · 1h
                                            </div>
                                        </div>
                                    </a>
                                    <a className="dropdown-item text-center small text-gray-500" href="#">
                                        {__('messages.read_more_messages')}
                                    </a>
                                </div>
                            </li>

                            {/* ---- Topbar Divider ---- */}
                            <div className="topbar-divider d-none d-sm-block"></div>

                            {/* ---- Nav Item - User Information ---- */}
                            <li className="nav-item dropdown no-arrow">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    id="userDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                                        {auth?.user?.name || __('messages.user') || 'User'}
                                    </span>
                                    <img
                                        className="img-profile rounded-circle"
                                        src={
                                            auth?.user?.avatar ||
                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(auth?.user?.name || 'U')}&background=4e73df&color=fff&size=60`
                                        }
                                        alt={auth?.user?.name || 'User'}
                                    />
                                </a>
                                {/* Dropdown - User Information */}
                                <div
                                    className="dropdown-menu dropdown-menu-end shadow animated--grow-in"
                                    aria-labelledby="userDropdown"
                                >
                                    <Link className="dropdown-item" href={route('profile.edit')}>
                                        <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                                        {__('messages.profile')}
                                    </Link>
                                    <Link className="dropdown-item" href={route('notifications.edit')}>
                                        <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                                        {__('messages.settings')}
                                    </Link>
                                    <Link className="dropdown-item" href={route('admin.activity-log')}>
                                        <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                                        {__('messages.activity_log')}
                                    </Link>
                                    <div className="dropdown-divider"></div>
                                    <a
                                        className="dropdown-item"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#logoutModal"
                                    >
                                        <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                        {__('auth.logout')}
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </nav>
                    {/* ===== End of Topbar ===== */}

                    {/* ---- Begin Page Content ---- */}
                    <div className="container-fluid">{children}</div>
                    {/* /.container-fluid */}
                </div>
                {/* ===== End of Main Content ===== */}

                {/* ---- Footer ---- */}
                <footer className="sticky-footer bg-white">
                    <div className="container my-auto">
                        <div className="copyright text-center my-auto">
                            <span>
                                {__('messages.ui_copyright', {
                                    year: String(new Date().getFullYear()),
                                })}
                            </span>
                        </div>
                    </div>
                </footer>
                {/* ===== End of Footer ===== */}
            </div>
            {/* ======= End of Content Wrapper ======= */}

            {/* =========================================================== */}
            {/* Scroll to Top Button                                        */}
            {/* =========================================================== */}
            <a className="scroll-to-top rounded" href="#page-top">
                <i className="fas fa-angle-up"></i>
            </a>

            {/* =========================================================== */}
            {/* Logout Modal                                                */}
            {/* =========================================================== */}
            <div
                className="modal fade"
                id="logoutModal"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                                {__('messages.logout_confirm_title')}
                            </h5>
                            <button
                                className="close"
                                type="button"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {__('messages.logout_confirm_message')}
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                type="button"
                                data-bs-dismiss="modal"
                            >
                                {__('messages.cancel')}
                            </button>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="btn btn-primary"
                            >
                                {__('auth.logout')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
